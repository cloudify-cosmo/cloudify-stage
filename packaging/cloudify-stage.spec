%global __os_install_post %(echo '%{__os_install_post}' | sed -e 's!/usr/lib[^[:space:]]*/brp-python-bytecompile[[:space:]].*$!!g')
%define _libdir %{_exec_prefix}/lib
%define stage_path /opt/cloudify-stage
%define logs_path /var/log/cloudify/stage

Name:           cloudify-stage
Version:        %{CLOUDIFY_VERSION}
Release:        %{CLOUDIFY_PACKAGE_RELEASE}%{?dist}
Summary:        Cloudify UI
Group:          Applications/Multimedia
License:        Apache 2.0
URL:            https://github.com/cloudify-cosmo/cloudify-stage
Vendor:         Cloudify Platform Ltd.
Packager:       Cloudify Platform Ltd.

BuildRequires:  nodejs >= 16.16.0, rsync
%if "%{arch}" == "arm64"
BuildRequires:  gcc-c++, gcc, libsass, libpng-devel
%endif
Requires:       nodejs >= 16.16.0, cloudify-rest-service, nginx, shadow-utils
AutoReqProv:    no


%description

Cloudify Stage provides Graphical User Interface for managing and analyzing Cloudify Manager.


%prep

export LIBSASS_EXT="no"
npm run beforebuild:no-tests
%if "%{arch}" == "arm64"
npm install -g node-gyp
npm install sharp --build-from-source --prefix backend
%endif


%build

npm run build


%install

# Adding stage files
mkdir -p %{buildroot}%{stage_path}
cp %{_builddir}/package.json %{buildroot}%{stage_path}
rsync -avrq --exclude='test/' --exclude='package-lock.json' %{_builddir}/backend %{buildroot}%{stage_path}
rsync -avrq --exclude='me.json*' %{_builddir}/conf %{buildroot}%{stage_path}
cp -r %{_builddir}/dist %{buildroot}%{stage_path}

# Adding system files
cp -r %{_builddir}/packaging/files/* %{buildroot}
mkdir -p %{buildroot}%{logs_path}


%check

visudo -cf %{buildroot}/etc/sudoers.d/cloudify-stage


%pre

groupadd -fr stage_group
getent passwd stage_user >/dev/null || useradd -r -g stage_group -d /opt/cloudify-stage -s /sbin/nologin stage_user
usermod -aG cfyuser stage_user
usermod -aG stage_group cfyuser
getent group nginx >/dev/null || groupadd -r nginx
getent passwd nginx >/dev/null || useradd -r -g nginx -s /sbin/nologin -d /var/cache/nginx -c "nginx user" nginx
usermod -aG stage_group nginx


%files

%defattr(-,root,root)
/etc/logrotate.d/cloudify-stage
/etc/sudoers.d/cloudify-stage
%{_libdir}/systemd/system/cloudify-stage.service
%config(noreplace) %{stage_path}/conf/manager.json
%config(noreplace) %{stage_path}/conf/app.json
%attr(555,root,cfyuser) /opt/cloudify/stage/restore-snapshot.py
%attr(-,stage_user,stage_group) %{stage_path}
%attr(-,cfyuser,cfyuser) %{stage_path}/conf
%attr(-,stage_user,stage_group) %{logs_path}

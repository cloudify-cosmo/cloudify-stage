%define stage_path /opt/%{name}
%define logs_path /var/log/cloudify/stage

Name:           cloudify-stage
Version:        %{CLOUDIFY_VERSION}
Release:        %{CLOUDIFY_PACKAGE_RELEASE}%{?dist}
Summary:        Cloudify UI
Group:          Applications/Multimedia
License:        Apache 2.0
URL:            https://github.com/cloudify-cosmo/%{name}
Vendor:         Cloudify Platform Ltd.
Packager:       Cloudify Platform Ltd.

BuildRequires:  nodejs >= 12.16.1, rsync
Requires:       nodejs >= 12.16.1
AutoReqProv:    no

%description

Cloudify Stage provides Graphical User Interface for managing and analyzing Cloudify Manager.


%prep

npm run beforebuild


%build

npm run build


%install

mkdir -p %{buildroot}%{stage_path}
cp %{_builddir}/package.json %{buildroot}%{stage_path}
cp -r %{_builddir}/backend %{buildroot}%{stage_path}
rsync -avr --exclude='me.json*' %{_builddir}/conf %{buildroot}%{stage_path}
cp -r %{_builddir}/dist %{buildroot}%{stage_path}

mkdir -p %{buildroot}%{logs_path}


%pre

groupadd -fr stage_group
getent passwd stage_user >/dev/null || useradd -r -g stage_group -d /opt/cloudify-stage -s /sbin/nologin stage_user
usermod -aG cfyuser stage_user
usermod -aG stage_group cfyuser


%files

%attr(-,stage_user,stage_group) %{stage_path}
%attr(-,cfyuser,cfyuser) %{stage_path}/conf
%attr(-,stage_user,stage_group) %{logs_path}

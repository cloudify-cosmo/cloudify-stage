%define _use_internal_dependency_generator 0
%define __find_provides         %{nil}
%define __find_requires         %{nil}


Name:           cloudify-stage
Version:        %{CLOUDIFY_VERSION}
Release:        %{CLOUDIFY_PACKAGE_RELEASE}%{?dist}
Summary:        Cloudify Stage
Group:          Applications/Multimedia
License:        Apache 2.0
URL:            https://github.com/cloudify-cosmo/cloudify-stage
Vendor:         Cloudify Platform Ltd.
Packager:       Cloudify Platform Ltd.

Requires:       nodejs
BuildRequires:  %{requires}, git
Requires(pre):  shadow-utils

%description
Cloudify's REST Service.

%build
export NPM_PACKAGES=/opt/npm-packages
export PATH="$NPM_PACKAGES/bin:$PATH"
unset MANPATH
export MANPATH="$NPM_PACKAGES/share/man:$(manpath)"

echo prefix=${NPM_PACKAGES} > ~/.npmrc

mkdir /builddir/.npm
mkdir -p ${NPM_PACKAGES}

cd ${RPM_SOURCE_DIR}
sh scripts/preinstall.sh
webpack --config webpack.config-prod.js --bail

%install
install -m 755 -d %{buildroot}/opt/cloudify-stage/dist
install -m 755 -d %{buildroot}/opt/cloudify-stage/backend
install -m 755 -d %{buildroot}/opt/cloudify-stage/conf
install -m 755 -d %{buildroot}/opt/cloudify-stage/resources
install -m 755 -d %{buildroot}/var/log/cloudify/stage
cp -r ${RPM_SOURCE_DIR}/dist/** %{buildroot}/opt/cloudify-stage/dist
cp -r ${RPM_SOURCE_DIR}/backend/** %{buildroot}/opt/cloudify-stage/backend
cp ${RPM_SOURCE_DIR}/conf/** %{buildroot}/opt/cloudify-stage/conf
cp ${RPM_SOURCE_DIR}/scripts/package-template.json %{buildroot}/opt/cloudify-stage/package.json


%pre
groupadd -fr stage_group
getent passwd stage_user >/dev/null || useradd -r -g stage_group -d /etc/cloudify -s /sbin/nologin stage_user


%files
%attr(750,stage_user,stage_group) /opt/cloudify-stage
%attr(750,stage_user,stage_group) /var/log/cloudify/stage

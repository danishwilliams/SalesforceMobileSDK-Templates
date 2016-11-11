/*
 * Copyright (c) 2016-present, salesforce.com, inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided
 * that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of conditions and the
 * following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or
 * promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * This script is called from forceios to inject app name, company id, org name etc in the template
 */

module.exports.prepare = function(config, replaceInFiles, moveFile, removeFile) {

    var path = require('path');

    // Values in template
    var templateAppName = 'iOSNativeSwiftTemplate';
    var templatePackageName = 'com.salesforce.iosnativeswifttemplate';
    var templateOrganization = 'iOSNativeSwiftTemplateOrganizationName';

    // Key files
    var templatePodfile = 'Podfile';
    var templatePackageJsonFile = 'package.json';
    var templateProjectDir = templateAppName + '.xcodeproj';
    var templateProjectFile = path.join(templateProjectDir, 'project.pbxproj');
    var templateSchemeFile = path.join(templateAppName + '.xcodeproj', 'xcshareddata', 'xcschemes', templateAppName + '.xcscheme');
    var templateBridgingHeaderFile = path.join(templateAppName, 'Bridging-Header.h');
    var templateInfoFile = path.join(templateAppName, 'Info.plist');
    var templateEntitlementsFile = path.join(templateAppName, templateAppName + '.entitlements');
    var templateAppDelegateFile = path.join(templateAppName, 'AppDelegate.swift');

    //
    // Replace in files
    //

    // app name
    replaceInFiles(templateAppName, config.appname, [templatePodfile, templatePackageJsonFile, templateProjectFile, templateSchemeFile, templateEntitlementsFile, templateAppDelegateFile]);

    // package name
    replaceInFiles(templatePackageName, config.packagename, [templateProjectFile, templateEntitlementsFile, templateProjectFile]);

    // org name
    replaceInFiles(templateOrganization, config.organization, [templateProjectFile]);

    //
    // Rename/move files
    //
    moveFile(templateSchemeFile, path.join(templateAppName + '.xcodeproj', 'xcshareddata', 'xcschemes', config.appname + '.xcscheme'));
    moveFile(templateEntitlementsFile, path.join(templateAppName, config.appname + '.entitlements'));
    moveFile(templateProjectDir, config.appname + '.xcodeproj');
    moveFile(templateAppName, config.appname);

    //
    // Run install.js
    //
    require('./install');

    // Return paths of workspace and file with oauth config
    return {
        workspacePath: config.appname + ".xcworkspace",
        bootconfigFile: path.join(config.appname, 'AppDelegate.swift')
    };

};
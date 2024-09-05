import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import { ErrorBoundary, UserPreferences, AboutModal, Header, useModal } from '@ohif/ui';
import i18n from '@ohif/i18n';
import { hotkeys } from '@ohif/core';
import { Toolbar } from '../Toolbar/Toolbar';

// For login user check
import Cookies from "js-cookie";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
//End for login user

const { availableLanguages, defaultLanguage, currentLanguage } = i18n;

function ViewerHeader({
  hotkeysManager,
  extensionManager,
  servicesManager,
  appConfig,
}: withAppTypes) {
  const navigate = useNavigate();
  const location = useLocation();

  const onClickReturnButton = () => {
    const { pathname } = location;
    const dataSourceIdx = pathname.indexOf('/', 1);
    const query = new URLSearchParams(window.location.search);
    const configUrl = query.get('configUrl');

    const dataSourceName = pathname.substring(dataSourceIdx + 1);
    const existingDataSource = extensionManager.getDataSources(dataSourceName);

    const searchQuery = new URLSearchParams();
    if (dataSourceIdx !== -1 && existingDataSource) {
      searchQuery.append('datasources', pathname.substring(dataSourceIdx + 1));
    }

    if (configUrl) {
      searchQuery.append('configUrl', configUrl);
    }

    navigate({
      pathname: '/',
      search: decodeURIComponent(searchQuery.toString()),
    });
  };

  const { t } = useTranslation();
  const { show, hide } = useModal();
  const { hotkeyDefinitions, hotkeyDefaults } = hotkeysManager;
  const versionNumber = process.env.VERSION_NUMBER;
  const commitHash = process.env.COMMIT_HASH;

  const menuOptions = [
    {
      title: t('Header:About'),
      icon: 'info',
      onClick: () =>
        show({
          content: AboutModal,
          title: t('AboutModal:About OHIF Viewer'),
          contentProps: { versionNumber, commitHash },
          containerDimensions: 'max-w-4xl max-h-4xl',
        }),
    },
    {
      title: t('Header:Preferences'),
      icon: 'settings',
      onClick: () =>
        show({
          title: t('UserPreferencesModal:User preferences'),
          content: UserPreferences,
          containerDimensions: 'w-[70%] max-w-[900px]',
          contentProps: {
            hotkeyDefaults: hotkeysManager.getValidHotkeyDefinitions(hotkeyDefaults),
            hotkeyDefinitions,
            currentLanguage: currentLanguage(),
            availableLanguages,
            defaultLanguage,
            onCancel: () => {
              hotkeys.stopRecord();
              hotkeys.unpause();
              hide();
            },
            onSubmit: ({ hotkeyDefinitions, language }) => {
              if (language.value !== currentLanguage().value) {
                i18n.changeLanguage(language.value);
              }
              hotkeysManager.setHotkeys(hotkeyDefinitions);
              hide();
            },
            onReset: () => hotkeysManager.restoreDefaultBindings(),
            hotkeysModule: hotkeys,
          },
        }),
    },
  ];

  // Add logout for user login
  // if (appConfig.oidc) {
  //   menuOptions.push({
  //     title: t('Header:Logout'),
  //     icon: 'power-off',
  //     onClick: async () => {
  //       navigate(`/logout?redirect_uri=${encodeURIComponent(window.location.href)}`);
  //     },
  //   });
  // }
  const ANONYMOUS_USER = "Anonymous User";
  let IS_AUTH = "true";
  try { IS_AUTH = process.env.IS_AUTH; } catch(e) {}

  const displayName = () => {
    try {
      // If auth
      if (IS_AUTH === "true") {
        const accessToken = Cookies.get("access_token");
        if (accessToken) {
          const decodedUser = jwtDecode(accessToken) as any;
          return decodedUser.display_name;
        } else {
          // Allow anonymous view. No redirect to login
          // gotoLogin();
          return ANONYMOUS_USER;
        }
      } else {
        return ANONYMOUS_USER;
      }
    } catch(e) {
      return ANONYMOUS_USER;
    }
  };

  // Push Logout if auth
  if (IS_AUTH === "true" && displayName() !== ANONYMOUS_USER) {
    menuOptions.unshift({
      icon: 'profile',
      title: t('Header:Change password'),
      onClick: () => {window.location.href = "/profile/change-password"}
    });
    menuOptions.push({
      icon: 'power-off',
      title: t('Header:Logout'),
      onClick: () => {
        // Remove cookie
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        delete axios.defaults.headers.common["Authorization"];

        const loginUrl = process.env.LOGIN_URL? process.env.LOGIN_URL:"/login";
        (window as Window).location = loginUrl;
      },
    });
  }
  // Push to first as profile's login user name
  menuOptions.unshift({
    icon: '',
    title: displayName(),
    onClick: () => {}
  });
  // End add logout

  return (
    <Header
      menuOptions={menuOptions}
      isReturnEnabled={!!appConfig.showStudyList}
      onClickReturnButton={onClickReturnButton}
      WhiteLabeling={appConfig.whiteLabeling}
      showPatientInfo={appConfig.showPatientInfo}
      servicesManager={servicesManager}
      Secondary={
        <Toolbar
          servicesManager={servicesManager}
          buttonSection="secondary"
        />
      }
      appConfig={appConfig}
    >
      <ErrorBoundary context="Primary Toolbar">
        <div className="relative flex justify-center gap-[4px]">
          <Toolbar servicesManager={servicesManager} />
        </div>
      </ErrorBoundary>
    </Header>
  );
}

export default ViewerHeader;

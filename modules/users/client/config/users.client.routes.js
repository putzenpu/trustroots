import welcomeTemplateUrl from '@/modules/users/client/views/authentication/welcome.client.view.html';
import profileEditTemplateUrl from '@/modules/users/client/views/profile/profile-edit.client.view.html';
import profileEditAboutTemplateUrl from '@/modules/users/client/views/profile/profile-edit-about.client.view.html';
import profileEditLocationsTemplateUrl from '@/modules/users/client/views/profile/profile-edit-locations.client.view.html';
import profileEditPhotoTemplateUrl from '@/modules/users/client/views/profile/profile-edit-photo.client.view.html';
import profileEditNetworksTemplateUrl from '@/modules/users/client/views/profile/profile-edit-networks.client.view.html';
import profileEditAccountTemplateUrl from '@/modules/users/client/views/profile/profile-edit-account.client.view.html';
import profileViewClientTemplateUrl from '@/modules/users/client/views/profile/profile-view.client.view.html';
import profileViewAboutTemplateUrl from '@/modules/users/client/views/profile/profile-view-about.client.view.html';
import profileviewAccommodationTemplateUrl from '@/modules/users/client/views/profile/profile-view-accommodation.client.view.html';
import profileViewBasicsTemplateUrl from '@/modules/users/client/views/profile/profile-view-basics.client.view.html';
import profileViewTribesTemplateUrl from '@/modules/users/client/views/profile/profile-view-tribes.client.view.html';
import profileSignupTemplateUrl from '@/modules/users/client/views/profile/profile-signup.client.view.html';
import signupTemplateUrl from '@/modules/users/client/views/authentication/signup.client.view.html';
import signinTemplateUrl from '@/modules/users/client/views/authentication/signin.client.view.html';
import confirmTemplateUrl from '@/modules/users/client/views/authentication/confirm-email.client.view.html';
import confirmInvalidTemplateUrl from '@/modules/users/client/views/authentication/confirm-email-invalid.client.view.html';
import forgotPasswordTemplateUrl from '@/modules/users/client/views/password/forgot-password.client.view.html';
import resetPasswordInvalidTemplateUrl from '@/modules/users/client/views/password/reset-password-invalid.client.view.html';
import resetPasswordSuccessTemplateUrl from '@/modules/users/client/views/password/reset-password-success.client.view.html';
import resetPasswordTemplateUrl from '@/modules/users/client/views/password/reset-password.client.view.html';
import profileRemoveTemplateUrl from '@/modules/users/client/views/profile/remove.client.view.html';
import profileReferencesTemplateUrl from '@/modules/users/client/views/profile/profile-view-references.client.view.html';

import AppConfig from '@/modules/core/client/app/config';

angular.module('users').config(UsersRoutes);

/* @ngInject */
function UsersRoutes($stateProvider) {
  $stateProvider
    // Invite route deprecated in 11-2018
    .state('invite', {
      url: '/invite',
      controller:
        /* @ngInject */
        function ($state) {
          $state.go('signup');
        },
      controllerAs: 'invite',
      requiresAuth: false,
      data: {
        pageTitle: 'Signup',
      },
    })
    // Users state routing
    .state('welcome', {
      url: '/welcome',
      templateUrl: welcomeTemplateUrl,
      requiresAuth: true,
      footerHidden: true,
      data: {
        pageTitle: 'Welcome',
      },
    })
    .state('profile-edit', {
      url: '/profile/edit',
      templateUrl: profileEditTemplateUrl,
      abstract: true,
      controller: 'ProfileEditController',
      controllerAs: 'profileEdit',
    })
    .state('profile-edit.about', {
      url: '',
      templateUrl: profileEditAboutTemplateUrl,
      controller: 'ProfileEditAboutController',
      controllerAs: 'profileEditAbout',
      requiresAuth: true,
      data: {
        pageTitle: 'Edit profile',
      },
    })
    .state('profile-edit.locations', {
      url: '/locations',
      templateUrl: profileEditLocationsTemplateUrl,
      controller: 'ProfileEditLocationsController',
      controllerAs: 'profileEditLocations',
      requiresAuth: true,
      resolve: {
        // A string value resolves to a service
        SettingsService: 'SettingsService',
        appSettings: function (SettingsService) {
          return SettingsService.get();
        },
      },
      data: {
        pageTitle: 'Edit your locations',
      },
    })
    .state('profile-edit.photo', {
      url: '/photo',
      templateUrl: profileEditPhotoTemplateUrl,
      controller: 'ProfileEditPhotoController',
      controllerAs: 'profileEditPhoto',
      requiresAuth: true,
      resolve: {
        // A string value resolves to a service
        SettingsService: 'SettingsService',
        appSettings: function (SettingsService) {
          return SettingsService.get();
        },
      },
      data: {
        pageTitle: 'Edit profile photo',
      },
    })
    .state('profile-edit.networks', {
      url: '/networks',
      templateUrl: profileEditNetworksTemplateUrl,
      controller: 'ProfileEditNetworksController',
      controllerAs: 'profileEditNetworks',
      requiresAuth: true,
      data: {
        pageTitle: 'Edit Profile networks',
      },
    })
    .state('profile-edit.account', {
      url: '/account',
      templateUrl: profileEditAccountTemplateUrl,
      controller: 'ProfileEditAccountController',
      controllerAs: 'profileEditAccount',
      requiresAuth: true,
      data: {
        pageTitle: 'Account',
      },
    })
    .state('profile', {
      url: '/profile/:username',
      templateUrl: profileViewClientTemplateUrl,
      controller: 'ProfileController',
      controllerAs: 'profileCtrl',
      requiresAuth: true,
      abstract: true,
      resolve: {
        // A string value resolves to a service
        UserProfilesService: 'UserProfilesService',
        ContactByService: 'ContactByService',
        SettingsService: 'SettingsService',
        ContactsListService: 'ContactsListService',

        appSettings: function (SettingsService) {
          return SettingsService.get();
        },

        profile: function (UserProfilesService, $stateParams, $q) {
          return UserProfilesService.get({
            username: $stateParams.username,
          }).$promise.catch(function (e) {
            if (e.status === 404) {
              // when user was not found, resolving with empty user profile, in order to display the User Not Found error.
              return { $promise: $q.resolve({}), $resolved: true };
            }

            throw e;
          });
        },

        // Contact is loaded only after profile is loaded, because we need the profile ID
        contact: function (ContactByService, profile, Authentication) {
          return profile.$promise.then(
            function (profile) {
              // when user doesn't exist, no need to load contact
              if (!profile._id) {
                return;
              }

              if (
                Authentication.user &&
                Authentication.user._id === profile._id
              ) {
                // No profile found or looking at own profile: no need to load contact
                return;
              } else {
                // Load contact
                return ContactByService.get({ userId: profile._id });
              }
            },
            // Fetch failures
            function () {
              return;
            },
          );
        },

        // Contacts list is loaded only after profile is loaded, because we need the profile ID
        contacts: function (ContactsListService, profile) {
          return profile.$promise.then(function (profile) {
            // when user doesn't exist, no need to load contacts
            if (!profile._id) {
              return;
            }

            // Load contact
            return ContactsListService.query({
              listUserId: profile._id,
            });
          });
        },
      },
      data: {
        pageTitle: 'Profile',
      },
    })
    .state('profile.about', {
      url: '',
      templateUrl: profileViewAboutTemplateUrl,
      requiresAuth: true,
      noScrollingTop: true,
      data: {
        pageTitle: 'Profile',
      },
    })
    .state('profile.accommodation', {
      url: '/accommodation',
      templateUrl: profileviewAccommodationTemplateUrl,
      requiresAuth: true,
      noScrollingTop: true,
      data: {
        pageTitle: 'Profile accommodation',
      },
    })
    .state('profile.overview', {
      url: '/overview',
      templateUrl: profileViewBasicsTemplateUrl,
      requiresAuth: true,
      noScrollingTop: true,
      data: {
        pageTitle: 'Profile overview',
      },
    })
    .state('profile.contacts', {
      url: '/contacts',
      template:
        '<contact-list onContactRemoved="profileCtrl.removeContact" appUser="app.user" contacts="profileCtrl.contacts"></contact-list>',
      requiresAuth: true,
      noScrollingTop: true,
      data: {
        pageTitle: 'Profile contacts',
      },
    })
    .state('profile.tribes', {
      url: '/tribes',
      templateUrl: profileViewTribesTemplateUrl,
      requiresAuth: true,
      noScrollingTop: true,
      data: {
        pageTitle: 'Profile tribes',
      },
    })
    // When attempting to look at profile as non-authenticated user
    .state('profile-signup', {
      url: '/profile-signup',
      templateUrl: profileSignupTemplateUrl,
      data: {
        pageTitle: 'Trustroots profile',
      },
    })
    // Auth routes
    .state('signup', {
      // `tribe`: preload tribe in suggested tribes list
      // `code`: prefill invite code
      // `mwr` used by Matre app if invite list is enabled
      url: '/signup?tribe&code&mwr',
      templateUrl: signupTemplateUrl,
      controller: 'SignupController',
      controllerAs: 'signup',
      headerHidden: true,
      footerHidden: true,
      // Don't reload ngView when URL parameters are changed
      reloadOnSearch: false,
      resolve: {
        // A string value resolves to a service
        SettingsService: 'SettingsService',

        appSettings: function (SettingsService) {
          return SettingsService.get();
        },
      },
      data: {
        pageTitle: 'Sign up',
      },
    })
    .state('signin', {
      url: '/signin?continue',
      templateUrl: signinTemplateUrl,
      controller: 'AuthenticationController',
      controllerAs: 'auth',
      headerHidden: true,
      footerHidden: true,
      resolve: {
        // A string value resolves to a service
        SettingsService: 'SettingsService',

        appSettings: function (SettingsService) {
          return SettingsService.get();
        },
      },
      data: {
        pageTitle: 'Sign in',
      },
    })
    .state('confirm-email', {
      url: '/confirm-email/:token?signup',
      templateUrl: confirmTemplateUrl,
      requiresAuth: false,
      controller: 'ConfirmEmailController',
      controllerAs: 'confirmEmail',
      data: {
        pageTitle: 'Confirm email',
      },
    })
    .state('confirm-email-invalid', {
      url: '/confirm-email-invalid',
      templateUrl: confirmInvalidTemplateUrl,
      requiresAuth: false,
      data: {
        pageTitle: 'Confirm email invalid',
      },
    })
    // Password reset
    .state('forgot', {
      url: '/password/forgot?userhandle=',
      templateUrl: forgotPasswordTemplateUrl,
      controller: 'ForgotPasswordController',
      controllerAs: 'forgotPassword',
      footerHidden: true,
      data: {
        pageTitle: 'Reset password',
      },
    })
    .state('reset-invalid', {
      url: '/password/reset/invalid',
      templateUrl: resetPasswordInvalidTemplateUrl,
      footerHidden: true,
      data: {
        pageTitle: 'Reset password',
      },
    })
    .state('reset-success', {
      url: '/password/reset/success',
      templateUrl: resetPasswordSuccessTemplateUrl,
      footerHidden: true,
      data: {
        pageTitle: 'Reset password',
      },
    })
    .state('reset', {
      url: '/password/reset/:token',
      templateUrl: resetPasswordTemplateUrl,
      footerHidden: true,
      controller: 'ResetPasswordController',
      controllerAs: 'resetPassword',
      data: {
        pageTitle: 'Reset password',
      },
    })
    // Profile removal
    .state('remove', {
      url: '/remove/:token',
      templateUrl: profileRemoveTemplateUrl,
      footerHidden: true,
      headerHidden: true,
      requiresAuth: true,
      controller: 'RemoveProfileController',
      controllerAs: 'removeProfile',
      data: {
        pageTitle: 'Remove profile',
      },
    });

  if (AppConfig.appEnv !== 'production') {
    $stateProvider
      .state('profile.references', {
        url: '/references',
        templateUrl: profileReferencesTemplateUrl,
        requiresAuth: true,
        noScrollingTop: true,
        abstract: true,
        data: {
          pageTitle: 'Profile references',
        },
      })
      .state('profile.references.list', {
        url: '',
        template: '',
        requiresAuth: true,
        noScrollingTop: true,
        data: {
          pageTitle: 'Profile references',
        },
      })
      .state('profile.references.new', {
        url: '/new',
        template:
          '<create-reference userTo="profileCtrl.profile" userFrom="app.user"></create-reference>',
        requiresAuth: true,
        noScrollingTop: true,
        data: {
          pageTitle: 'Leave a reference',
        },
      });
  }
}

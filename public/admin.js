/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./client/src/admin/controllers/group-participants.controller.js":
/*!***********************************************************************!*\
  !*** ./client/src/admin/controllers/group-participants.controller.js ***!
  \***********************************************************************/
/***/ (() => {

eval("{/**\n * Poetry Slam Scoreboard - Group Participants Controller\n */\n\n(function () {\n  'use strict';\n\n  angular.module('psadmin').controller('GroupParticipantsCtrl', function ($scope, group, groups, globalParticipants, DialogService, $q, $filter) {\n    $scope.group = group;\n    $scope.groups = groups;\n    $scope.availableParticipants = globalParticipants.filter(function (participant) {\n      return !$scope.isParticipantAssigned(participant);\n    }).filter(function (participant) {\n      return !groups.filter(function (group) {\n        return group.participants.filter(function (groupParticipant) {\n          return groupParticipant.id === participant.id;\n        }).length > 0;\n      }).length > 0;\n    });\n    $scope.isParticipantAssigned = function (participant) {\n      return $scope.group.participants.filter(function (groupParticipant) {\n        return groupParticipant.id === participant.id;\n      }).length > 0;\n    };\n    $scope.addParticipant = function (participant) {\n      if (!$scope.isParticipantAssigned(participant)) {\n        $scope.group.participants.push({\n          id: participant.id,\n          scores: []\n        });\n      }\n    };\n    $scope.removeParticipant = function (groupParticipant) {\n      var index = $scope.group.participants.indexOf(groupParticipant);\n      if (index > -1) {\n        $scope.group.participants.splice(index, 1);\n      }\n    };\n    $scope.addGroupParticipant = function () {\n      DialogService.addGroupParticipant({}).then(function (result) {\n        if (!result.id) {\n          result.id = new Date().getTime().toString();\n        }\n        globalParticipants.push(result);\n        $scope.addParticipant(result);\n      });\n    };\n  });\n})();\n\n//# sourceURL=webpack://scoreboard_poetry_slam/./client/src/admin/controllers/group-participants.controller.js?\n}");

/***/ }),

/***/ "./client/src/admin/controllers/simple-list.controller.js":
/*!****************************************************************!*\
  !*** ./client/src/admin/controllers/simple-list.controller.js ***!
  \****************************************************************/
/***/ (() => {

eval("{/**\n * Poetry Slam Scoreboard - Simple List Controller\n * Generic controller for managing lists of entries\n */\n\n(function () {\n  'use strict';\n\n  angular.module('psadmin').controller('SimpleListCtrl', function ($scope, entries, dialogFn, newEntryFn) {\n    $scope.entries = entries;\n    $scope.addEntry = function () {\n      dialogFn(newEntryFn()).then(function (result) {\n        if (!result.id) {\n          result.id = new Date().getTime().toString();\n        }\n        $scope.entries.push(result);\n      });\n    };\n    $scope.editEntry = function (entry) {\n      dialogFn(entry).then(function (result) {\n        angular.extend(entry, result);\n      });\n    };\n  });\n})();\n\n//# sourceURL=webpack://scoreboard_poetry_slam/./client/src/admin/controllers/simple-list.controller.js?\n}");

/***/ }),

/***/ "./client/src/admin/css/admin-custom.css":
/*!***********************************************!*\
  !*** ./client/src/admin/css/admin-custom.css ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://scoreboard_poetry_slam/./client/src/admin/css/admin-custom.css?\n}");

/***/ }),

/***/ "./client/src/admin/filters/filters.js":
/*!*********************************************!*\
  !*** ./client/src/admin/filters/filters.js ***!
  \*********************************************/
/***/ (() => {

eval("{/**\n * Poetry Slam Scoreboard - Admin Filters\n */\n\n(function () {\n  'use strict';\n\n  // Entry lookup filter\n  angular.module('psadmin').filter('entryOfId', function () {\n    return function (list, id) {\n      if (!list || !id) return null;\n      var matching = list.filter(function (entry) {\n        return entry.id === id;\n      });\n      return matching.length > 0 ? matching[0] : null;\n    };\n  });\n\n  // Participant lookup filter\n  angular.module('psadmin').filter('participantOfId', function ($rootScope, $filter) {\n    return function (id) {\n      return $filter('entryOfId')($rootScope.event.participants, id);\n    };\n  });\n})();\n\n//# sourceURL=webpack://scoreboard_poetry_slam/./client/src/admin/filters/filters.js?\n}");

/***/ }),

/***/ "./client/src/admin/js/app.js":
/*!************************************!*\
  !*** ./client/src/admin/js/app.js ***!
  \************************************/
/***/ (() => {

eval("{/**\n * Poetry Slam Scoreboard - Admin Application\n * Main application module and configuration\n */\n\n(function () {\n  'use strict';\n\n  var psadmin = angular.module('psadmin', ['ngRoute', 'ngMaterial', 'ngAnimate', 'ps.sync', 'ps.storage', 'ps.files']);\n\n  // Theme Configuration\n  psadmin.config(function ($mdThemingProvider, $mdIconProvider, $mdAriaProvider) {\n    $mdThemingProvider.theme('default').primaryPalette('red').accentPalette('orange');\n    $mdIconProvider.iconSet('av', 'material-icons/av-icons.svg').iconSet('action', 'material-icons/action-icons.svg').iconSet('content', 'material-icons/content-icons.svg').iconSet('image', 'material-icons/image-icons.svg').iconSet('alert', 'material-icons/alert-icons.svg').iconSet('notification', 'material-icons/notification-icons.svg').iconSet('navigation', 'material-icons/navigation-icons.svg').iconSet('communication', 'material-icons/communication-icons.svg').iconSet('device', 'material-icons/device-icons.svg').iconSet('editor', 'material-icons/editor-icons.svg').iconSet('file', 'material-icons/file-icons.svg').iconSet('hardware', 'material-icons/hardware-icons.svg').iconSet('maps', 'material-icons/maps-icons.svg').iconSet('social', 'material-icons/social-icons.svg').iconSet('toggle', 'material-icons/toggle-icons.svg');\n    $mdAriaProvider.disableWarnings();\n  });\n\n  // Debug Configuration\n  psadmin.config(function ($compileProvider) {\n    $compileProvider.debugInfoEnabled(false);\n  });\n\n  // Application Initialization\n  psadmin.run(function ($rootScope, SyncService, FileService, PresentationService) {\n    var urlParams = new URLSearchParams(window.location.search);\n    if (urlParams.get('embedded')) {\n      $rootScope.embedded = true;\n    }\n    SyncService.restoreInitialValues();\n    FileService.readVideoList();\n    FileService.readAudioList();\n    PresentationService.updatePresentation($rootScope.event);\n  });\n})();\n\n//# sourceURL=webpack://scoreboard_poetry_slam/./client/src/admin/js/app.js?\n}");

/***/ }),

/***/ "./client/src/admin/js/routes.js":
/*!***************************************!*\
  !*** ./client/src/admin/js/routes.js ***!
  \***************************************/
/***/ (() => {

eval("{/**\n * Poetry Slam Scoreboard - Admin Routes Configuration\n */\n\n(function () {\n  'use strict';\n\n  angular.module('psadmin').config(function ($routeProvider, $locationProvider) {\n    $routeProvider.when('/', {\n      templateUrl: './modules/admin/partials/presentation.html',\n      controller: 'PresentationCtrl',\n      resolve: {\n        event: function event($rootScope) {\n          return $rootScope.event;\n        }\n      }\n    }).when('/presentation', {\n      templateUrl: './modules/admin/partials/presentation.html',\n      controller: 'PresentationCtrl',\n      resolve: {\n        event: function event($rootScope) {\n          return $rootScope.event;\n        }\n      }\n    }).when('/participants', {\n      templateUrl: './modules/admin/partials/participants.html',\n      controller: 'SimpleListCtrl',\n      resolve: {\n        entries: function entries($rootScope) {\n          return $rootScope.event.participants;\n        },\n        dialogFn: function dialogFn(DialogService) {\n          return DialogService.addParticipant;\n        },\n        newEntryFn: function newEntryFn() {\n          return function () {\n            return {};\n          };\n        }\n      }\n    }).when('/competitions', {\n      templateUrl: './modules/admin/partials/competitions.html',\n      controller: 'SimpleListCtrl',\n      resolve: {\n        entries: function entries($rootScope) {\n          return $rootScope.event.competitions;\n        },\n        dialogFn: function dialogFn(DialogService) {\n          return DialogService.addCompetition;\n        },\n        newEntryFn: function newEntryFn() {\n          return function () {\n            return {\n              groups: [],\n              jurors: 7,\n              winners: 3\n            };\n          };\n        }\n      }\n    }).when('/competitions/:competitionId/groups', {\n      templateUrl: './modules/admin/partials/competitionsGroups.html',\n      controller: 'SimpleListCtrl',\n      resolve: {\n        entries: function entries($routeParams, $rootScope, EntityUtils) {\n          return EntityUtils.getById($rootScope.event.competitions, $routeParams.competitionId).groups;\n        },\n        dialogFn: function dialogFn(DialogService) {\n          return DialogService.addGroup;\n        },\n        newEntryFn: function newEntryFn() {\n          return function () {\n            return {\n              participants: []\n            };\n          };\n        }\n      }\n    }).when('/competitions/:competitionId/groups/:groupId', {\n      templateUrl: './modules/admin/partials/groupParticipants.html',\n      controller: 'GroupParticipantsCtrl',\n      resolve: {\n        group: function group($routeParams, $rootScope, EntityUtils) {\n          var competition = EntityUtils.getById($rootScope.event.competitions, $routeParams.competitionId);\n          return EntityUtils.getById(competition.groups, $routeParams.groupId);\n        },\n        groups: function groups($routeParams, $rootScope, EntityUtils) {\n          return EntityUtils.getById($rootScope.event.competitions, $routeParams.competitionId).groups;\n        },\n        globalParticipants: function globalParticipants($rootScope) {\n          return $rootScope.event.participants;\n        }\n      }\n    }).when('/videos', {\n      templateUrl: './modules/admin/partials/videos.html',\n      controller: 'VideoAdminCtrl'\n    }).when('/sounds', {\n      templateUrl: './modules/admin/partials/sounds.html',\n      controller: 'SoundAdminCtrl'\n    }).when('/AdmistrationInterface', {\n      templateUrl: './modules/admin/partials/admistrationInterface.html',\n      controller: 'AdministrationInterfaceCtrl'\n    }).when('/about', {\n      templateUrl: './modules/admin/partials/about.html',\n      controller: 'AboutCtrl',\n      resolve: {\n        env: function env($rootScope) {\n          return $rootScope.env;\n        }\n      }\n    }).otherwise({\n      redirectTo: '/'\n    });\n  });\n})();\n\n//# sourceURL=webpack://scoreboard_poetry_slam/./client/src/admin/js/routes.js?\n}");

/***/ }),

/***/ "./client/src/admin/services/csv-export.service.js":
/*!*********************************************************!*\
  !*** ./client/src/admin/services/csv-export.service.js ***!
  \*********************************************************/
/***/ (() => {

eval("{/**\n * Poetry Slam Scoreboard - CSV Export Service\n * Handles exporting competition data to CSV format\n */\n\n(function () {\n  'use strict';\n\n  angular.module('psadmin').service('csvExportService', function ($rootScope, Blob, FileSaver) {\n    this.exportCSV = function (competitionId) {\n      var e = $rootScope.event;\n      var matchingCompetitionKeys = Object.keys(e.competitions).filter(function (key) {\n        return e.competitions[key].id === competitionId;\n      });\n      if (matchingCompetitionKeys.length === 0) return;\n      var competition = e.competitions[matchingCompetitionKeys[0]];\n      var content = '';\n      function append(text) {\n        content += (text || '') + ';';\n      }\n\n      // Header\n      append('Group');\n      append('Name');\n      append('Slam');\n      append('Gender');\n      for (var i = 1; i <= competition.jurors; i++) {\n        append('Juror ' + i);\n      }\n      append('Total');\n      append('Total (2nd)');\n      append('Total (3rd)');\n      content += '\\n';\n\n      // Data rows\n      competition.groups.forEach(function (group) {\n        group.participants.forEach(function (groupParticipant) {\n          var participant = e.participants.filter(function (p) {\n            return p.id === groupParticipant.id;\n          })[0];\n          if (participant) {\n            append(group.name);\n            append(participant.name);\n            append(participant.slam);\n            append(participant.gender);\n            if (groupParticipant.scores) {\n              groupParticipant.scores.forEach(function (score) {\n                append(score.value);\n              });\n            }\n            append(participant.totalScore);\n            append(participant.secondTotalScore);\n            append(participant.thirdTotalScore);\n            content += '\\n';\n          }\n        });\n      });\n      var blob = new Blob([content], {\n        type: 'text/csv;charset=utf-8'\n      });\n      FileSaver.saveAs(blob, competition.name + '-scores.csv');\n    };\n    return this;\n  });\n})();\n\n//# sourceURL=webpack://scoreboard_poetry_slam/./client/src/admin/services/csv-export.service.js?\n}");

/***/ }),

/***/ "./client/src/admin/services/dialog.service.js":
/*!*****************************************************!*\
  !*** ./client/src/admin/services/dialog.service.js ***!
  \*****************************************************/
/***/ (() => {

eval("{/**\n * Poetry Slam Scoreboard - Dialog Service\n * Handles modal dialogs for adding/editing entries\n */\n\n(function () {\n  'use strict';\n\n  angular.module('psadmin').service('DialogService', function ($mdDialog) {\n    this.addParticipant = function (entry) {\n      return $mdDialog.show({\n        templateUrl: 'modules/admin/partials/dialogs/participantDialog.html',\n        controller: function controller($scope, $mdDialog) {\n          $scope.data = angular.copy(entry) || {};\n          $scope.save = function () {\n            $mdDialog.hide($scope.data);\n          };\n          $scope.cancel = function () {\n            $mdDialog.cancel();\n          };\n        }\n      });\n    };\n    this.addCompetition = function (entry) {\n      return $mdDialog.show({\n        templateUrl: 'modules/admin/partials/dialogs/competitionDialog.html',\n        controller: function controller($scope, $mdDialog) {\n          $scope.data = angular.copy(entry) || {};\n          $scope.save = function () {\n            $mdDialog.hide($scope.data);\n          };\n          $scope.cancel = function () {\n            $mdDialog.cancel();\n          };\n        }\n      });\n    };\n    this.addGroup = function (entry) {\n      return $mdDialog.show({\n        templateUrl: 'modules/admin/partials/dialogs/groupDialog.html',\n        controller: function controller($scope, $mdDialog) {\n          $scope.data = angular.copy(entry) || {};\n          $scope.save = function () {\n            $mdDialog.hide($scope.data);\n          };\n          $scope.cancel = function () {\n            $mdDialog.cancel();\n          };\n        }\n      });\n    };\n    this.addGroupParticipant = function (entry) {\n      return $mdDialog.show({\n        templateUrl: 'modules/admin/partials/dialogs/groupParticipantDialog.html',\n        controller: function controller($scope, $mdDialog) {\n          $scope.data = angular.copy(entry) || {};\n          $scope.save = function () {\n            $mdDialog.hide($scope.data);\n          };\n          $scope.cancel = function () {\n            $mdDialog.cancel();\n          };\n        }\n      });\n    };\n  });\n})();\n\n//# sourceURL=webpack://scoreboard_poetry_slam/./client/src/admin/services/dialog.service.js?\n}");

/***/ }),

/***/ "./client/src/admin/services/entity-utils.service.js":
/*!***********************************************************!*\
  !*** ./client/src/admin/services/entity-utils.service.js ***!
  \***********************************************************/
/***/ (() => {

eval("{/**\n * Poetry Slam Scoreboard - Entity Utils Service\n * Utility functions for working with entities\n */\n\n(function () {\n  'use strict';\n\n  angular.module('psadmin').service('EntityUtils', function () {\n    this.getById = function (list, id) {\n      if (!list || !id) return null;\n      for (var i = 0; i < list.length; i++) {\n        if (list[i].id === id) {\n          return list[i];\n        }\n      }\n      return null;\n    };\n  });\n})();\n\n//# sourceURL=webpack://scoreboard_poetry_slam/./client/src/admin/services/entity-utils.service.js?\n}");

/***/ }),

/***/ "./client/src/css/vendor-admin.css":
/*!*****************************************!*\
  !*** ./client/src/css/vendor-admin.css ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://scoreboard_poetry_slam/./client/src/css/vendor-admin.css?\n}");

/***/ }),

/***/ "./client/src/js/vendor-admin.js":
/*!***************************************!*\
  !*** ./client/src/js/vendor-admin.js ***!
  \***************************************/
/***/ (() => {

eval("{throw new Error(\"Module parse failed: Unexpected token (74720:0)\\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\\n| (function(angular) {\\n|     'use strict';\\n> \");\n\n//# sourceURL=webpack://scoreboard_poetry_slam/./client/src/js/vendor-admin.js?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module doesn't tell about it's top-level declarations so it can't be inlined
/******/ 	__webpack_modules__["./client/src/js/vendor-admin.js"](0, {}, __webpack_require__);
/******/ 	__webpack_modules__["./client/src/admin/js/app.js"](0, {}, __webpack_require__);
/******/ 	__webpack_modules__["./client/src/admin/js/routes.js"](0, {}, __webpack_require__);
/******/ 	__webpack_modules__["./client/src/admin/services/dialog.service.js"](0, {}, __webpack_require__);
/******/ 	__webpack_modules__["./client/src/admin/services/entity-utils.service.js"](0, {}, __webpack_require__);
/******/ 	__webpack_modules__["./client/src/admin/services/csv-export.service.js"](0, {}, __webpack_require__);
/******/ 	__webpack_modules__["./client/src/admin/filters/filters.js"](0, {}, __webpack_require__);
/******/ 	__webpack_modules__["./client/src/admin/controllers/simple-list.controller.js"](0, {}, __webpack_require__);
/******/ 	__webpack_modules__["./client/src/admin/controllers/group-participants.controller.js"](0, {}, __webpack_require__);
/******/ 	__webpack_modules__["./client/src/css/vendor-admin.css"](0, {}, __webpack_require__);
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./client/src/admin/css/admin-custom.css"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;
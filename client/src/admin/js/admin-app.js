    var psadmin = angular.module('psadmin', [
        'ngMaterial',
        'ngRoute',
        'ngMessages',
        'ng-sortable',
        'ps.sync',
        'ps.storage',
        'ngFileSaver',
        'ngFileUpload',
        'md.data.table',
    ]);

    psadmin.config(function($mdThemingProvider, $mdIconProvider, $mdAriaProvider) {
        $mdIconProvider
            .iconSet('navigation', 'material-icons/navigation-icons.svg', 24)
            .iconSet('social', 'material-icons/social-icons.svg', 24)
            .iconSet('content', 'material-icons/content-icons.svg', 24)
            .iconSet('action', 'material-icons/action-icons.svg', 24)
            .iconSet('image', 'material-icons/image-icons.svg', 24)
            .iconSet('av', 'material-icons/av-icons.svg', 24)
            .iconSet('communication', 'material-icons/communication-icons.svg', 24)
            .iconSet('file', 'material-icons/file-icons.svg', 24)
            .iconSet('action', 'material-icons/action-icons.svg', 24)
            .iconSet('editor', 'material-icons/editor-icons.svg', 24);

        $mdThemingProvider.definePalette('mcgpalette0', {
            50: '#858585',
            100: '#5e5e5e',
            200: '#424242',
            300: '#1f1f1f',
            400: '#0f0f0f',
            500: '#000000',
            600: '#000000',
            700: '#000000',
            800: '#000000',
            900: '#000000',
            A100: '#858585',
            A200: '#5e5e5e',
            A400: '#0f0f0f',
            A700: '#000000',
            contrastDefaultColor: 'light',
            contrastDarkColors: '50 A100',
        });

        $mdThemingProvider.definePalette('mcgpalette1', {
            50: '#ffffff',
            100: '#ffffff',
            200: '#f4f4f4',
            300: '#d1d1d1',
            400: '#c1c1c1',
            500: '#b2b2b2',
            600: '#a3a3a3',
            700: '#939393',
            800: '#848484',
            900: '#757575',
            A100: '#ffffff',
            A200: '#ffffff',
            A400: '#c1c1c1',
            A700: '#939393',
            contrastDefaultColor: 'light',
            contrastDarkColors: '50 100 200 300 400 500 600 700 800 A100 A200 A400 A700',
        });

        $mdThemingProvider.theme('default').primaryPalette('mcgpalette0').accentPalette('mcgpalette1');

        $mdAriaProvider.disableWarnings();
    });

    psadmin.config(function($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    });

    psadmin.run(function($rootScope, SyncService, FileService, PresentationService) {
        SyncService.updateEventScope().then(function() {
            if (!FileService.isRecoverable()) {
                $rootScope.event.videos = [];
                $rootScope.event.sounds = [];
                $rootScope.event.bgVideos = {};
            } else {
                PresentationService.updatePresentation($rootScope.event);
            }
        });
    });
})(angular);

(function() {
    'use strict';

    angular.module('psadmin').config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/participants', {
                templateUrl: './modules/admin/partials/participants.html',
                controller: 'SimpleListCtrl',
                resolve: {
                    entries: function($rootScope) {
                        return $rootScope.event.participants;
                    },
                    dialogFn: function(DialogService) {
                        return DialogService.showParticipantDialog;
                    },
                    newEntryFn: function(EntityUtils) {
                        return function() {
                            return {
                                id: EntityUtils.getUid(),
                            };
                        };
                    },
                },
            })
            .when('/videos', {
                templateUrl: './modules/admin/partials/videos.html',
                controller: 'VideoAdminCtrl',
            })
            .when('/sounds', {
                templateUrl: './modules/admin/partials/sounds.html',
                controller: 'SoundAdminCtrl',
            })
            .when('/AdmistrationInterface', {
                templateUrl: './modules/admin/partials/admistrationInterface.html',
                controller: 'AdministrationInterfaceCtrl',
            })
            .when('/competitions', {
                templateUrl: './modules/admin/partials/competitions.html',
                controller: 'SimpleListCtrl',
                resolve: {
                    entries: function($rootScope) {
                        return $rootScope.event.competitions;
                    },
                    dialogFn: function(DialogService) {
                        return DialogService.showCompetitionDialog;
                    },
                    newEntryFn: function(EntityUtils) {
                        return function() {
                            return {
                                id: EntityUtils.getUid(),
                                groups: [],
                            };
                        };
                    },
                },
            })
            .when('/competitions/:id/groups', {
                templateUrl: './modules/admin/partials/competitionsGroups.html',
                controller: 'SimpleListCtrl',
                resolve: {
                    entries: function($rootScope, $route, $filter) {
                        var competition = $filter('entryOfId')($route.current.params.id, $rootScope.event.competitions);
                        return competition.groups;
                    },
                    dialogFn: function(DialogService) {
                        return DialogService.showGroupDialog;
                    },
                    newEntryFn: function($rootScope, $route, $filter, EntityUtils) {
                        return function() {
                            var competition = $filter('entryOfId')($route.current.params.id, $rootScope.event.competitions);
                            var groupNumber = competition.groups ? competition.groups.length + 1 : 1;
                            return {
                                id: EntityUtils.getUid(),
                                name: 'Gruppe ' + groupNumber,
                                participants: [],
                            };
                        };
                    },
                },
            })
            .when('/competitions/:competitionId/groups/:id', {
                templateUrl: './modules/admin/partials/groupParticipants.html',
                controller: 'GroupParticipantsCtrl',
                resolve: {
                    group: function($rootScope, $route, $filter) {
                        var competition = $filter('entryOfId')($route.current.params.competitionId, $rootScope.event.competitions);
                        return $filter('entryOfId')($route.current.params.id, competition.groups);
                    },
                    groups: function($rootScope, $route, $filter) {
                        var competition = $filter('entryOfId')($route.current.params.competitionId, $rootScope.event.competitions);
                        return competition.groups;
                    },
                    globalParticipants: function($rootScope) {
                        return $rootScope.event.participants;
                    },
                },
            })
            .when('/presentation', {
                templateUrl: './modules/admin/partials/presentation.html',
                controller: 'PresentationCtrl',
                resolve: {
                    event: function($rootScope) {
                        return $rootScope.event;
                    },
                },
            })
            .when('/', {
                templateUrl: './modules/admin/partials/about.html',
                controller: 'AboutCtrl',
            })
            .otherwise({
                redirectTo: '/',
            });

        $locationProvider.hashPrefix('');
    });
})();

(function() {
    'use strict';
    angular.module('psadmin').service('DialogService', function($mdDialog) {
        var openDialog = function(templateUrl, data) {
            return new Promise(function(resolve) {
                $mdDialog.show({
                    templateUrl: templateUrl,
                    controller: function($scope, $mdDialog) {
                        $scope.data = data;
                        $scope.save = function() {
                            $mdDialog.hide();
                            resolve(data);
                        };
                        $scope.cancel = function() {
                            $mdDialog.hide();
                        };
                    },
                });
            });
        };

        var openSimpleEditDialog = function(templateUrl, entry) {
            entry = entry ? angular.copy(entry) : {};
            return openDialog(templateUrl, entry);
        };

        this.showParticipantDialog = function(participant) {
            return openSimpleEditDialog('./modules/admin/partials/dialogs/participantDialog.html', participant);
        };

        this.showCompetitionDialog = function(competition) {
            return openSimpleEditDialog('./modules/admin/partials/dialogs/competitionDialog.html', competition);
        };

        this.showGroupDialog = function(group) {
            return openSimpleEditDialog('./modules/admin/partials/dialogs/groupDialog.html', group);
        };

        this.showGroupParticipantDialog = function(groupParticipant, filterParticipantsFn) {
            groupParticipant = groupParticipant ? angular.copy(groupParticipant) : {};
            return openDialog('./modules/admin/partials/dialogs/groupParticipantDialog.html', {
                groupParticipant: groupParticipant,
                filterParticipantsFn: filterParticipantsFn,
            });
        };

        return this;
    });
})();

(function() {
    'use strict';
    angular.module('psadmin').directive('deleteButton', function($mdDialog) {
        return {
            restrict: 'E',
            scope: {
                list: '=',
                entry: '=',
            },
            templateUrl: './modules/admin/partials/deleteButton.html',
            link: function(scope, element, attrs) {
                scope.checkDelete = function(ev) {
                    var confirm = $mdDialog
                        .confirm()
                        .title('Wollen Sie den Eintrag wirklich Löschen?')
                        .textContent('Weg ist weg, das kommt nimmer wieder!')
                        .ariaLabel('Löschen')
                        .targetEvent(ev)
                        .ok('Löschen')
                        .cancel('Abbrechen');

                    $mdDialog.show(confirm).then(
                        function() {
                            if (typeof scope.list !== 'undefined') {
                                scope.list.splice(scope.list.indexOf(scope.entry), 1);
                            } else {
                                scope.entry = null;
                            }
                        },
                        function() {},
                    );
                };
            },
        };
    });
})();

(function() {
    'use strict';

    angular.module('psadmin').service('EntityUtils', function() {
        this.getUid = function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (Math.random() * 16) | 0,
                    v = c == 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
        };

        return this;
    });
})();
(function() {
    'use strict';

    angular.module('psadmin').filter('entryOfId', function() {
        return function(id, list) {
            if (!id || !list) return null;
            var matching = list.filter(function(entry) {
                return entry.id == id;
            });
            return matching.length > 0 ? matching[0] : null;
        };
    });
})();
(function() {
    'use strict';

    angular.module('psadmin').filter('participantOfId', function($rootScope, $filter) {
        return function(id) {
            return $filter('entryOfId')(id, $rootScope.event.participants);
        };
    });
})();
(function() {
    'use strict';

    angular.module('psadmin').controller('SimpleListCtrl', function($scope, entries, dialogFn, newEntryFn) {
        $scope.entries = entries;

        $scope.addEntry = function() {
            dialogFn(newEntryFn()).then(function(entry) {
                $scope.entries.push(entry);
            });
        };

        $scope.editEntry = function(entry) {
            dialogFn(entry).then(function(editedEntry) {
                angular.extend(entry, editedEntry);
            });
        };

        $scope.deleteEntry = function(entry) {
            $scope.entries.splice($scope.entries.indexOf(entry), 1);
        };
    });
})();

(function() {
    'use strict';

    angular.module('psadmin').controller('GroupParticipantsCtrl', function($scope, group, groups, globalParticipants, DialogService, $q, $filter) {
        $scope.group = group;

        var filterParticipants = function(searchText) {
            return $q(function(resolve) {
                var searchFor = searchText ? searchText.toLowerCase() : '';
                var result = globalParticipants
                    .filter(function(participant) {
                        return participant.name.toLowerCase().indexOf(searchFor) != -1 || !searchFor;
                    })
                    .filter(function(participant) {
                        return (
                            groups.filter(function(group) {
                                return $filter('entryOfId')(participant.id, group.participants);
                            }).length <= 0 &&
                            (!group.sacrifice || group.sacrifice.id !== participant.id)
                        );
                    });
                resolve(result);
            });
        };

        $scope.addParticipant = function() {
            DialogService.showGroupParticipantDialog(null, filterParticipants).then(function(data) {
                if (data.participant) {
                    $scope.group.participants.push({
                        id: data.participant.id,
                    });
                }
            });
        };

        $scope.editParticipant = function(groupParticipant) {
            var participant = $filter('entryOfId')(groupParticipant.id, globalParticipants);
            DialogService.showParticipantDialog(participant).then(function(editedParticipant) {
                angular.extend(participant, editedParticipant);
            });
        };

        $scope.addSacrifice = function() {
            DialogService.showGroupParticipantDialog(null, filterParticipants).then(function(data) {
                if (data.participant) {
                    $scope.group.sacrifice = {
                        id: data.participant.id,
                    };
                }
            });
        };
    });
})();

(function() {
    'use strict';

    var toFloat = function(value) {
        //if you pass NaN in value, this function also returns NaN
        return Math.round(parseFloat(value) * 10) / 10;
    };

    angular.module('psadmin').service('PresentationService', function($filter, StorageService, FileService, $q) {
        var that = this;
        this.getCompetition = function(event, id) {
            var result = $filter('entryOfId')(id, event.competitions);
            return result ? result : {};
        };

        this.getGroup = function(competition, id) {
            var result = $filter('entryOfId')(id, competition.groups);
            return result ? result : {};
        };

        this.getGroupParticipant = function(group, id) {
            var result = $filter('entryOfId')(id, group.participants);
            if (!result && group.sacrifice && group.sacrifice.id == id) {
                result = group.sacrifice;
            }
            return result ? result : null;
        };

        this.findGroupParticipant = function(competition, participantId) {
            if (!competition.groups) return null;
            var that = this;
            var result = null;
            competition.groups.forEach(function(group) {
                if (result != null) return true;
                result = that.getGroupParticipant(group, participantId);
            });
            return result;
        };

        this.getParticipant = function(event, id) {
            if (!id) return {};
            var result = $filter('entryOfId')(id, event.participants);
            return result ? result : null;
        };

        this.sumScore = function(scores) {
            var total = 0;
            scores.forEach(function(score) {
                if (score.value && !score.ignored) {
                    total += toFloat(score.value);
                }
            });
            return Math.round(total * 10) / 10;
        };

        this.sumScoreSecond = function(scores, enableIgnoredScores) {
            var total = 0;
            scores.forEach(function(score) {
                if (score.value) {
                    total += toFloat(score.value);
                }
            });
            return Math.round(total * 10) / 10;
        };

        var setSingleScoreToIgnoredFailsafe = function(scores) {
            if (scores && scores[0]) {
                scores[0].ignored = true;
            }
        };

        this.markIgnoredScores = function(scores) {
            var lowest = 99999,
                highest = -99999;
            var counterForRealNumbers = 0;
            scores.forEach(function(score) {
                if (!isNaN(parseFloat(score.value))) {
                    counterForRealNumbers++;
                }
            });
            //exit if there are less than 4 values
            if (counterForRealNumbers < 4) {
                return;
            }
            scores.forEach(function(score) {
                if (!isNaN(parseFloat(score.value))) {
                    var value = toFloat(score.value);
                    if (value < lowest) lowest = value;
                    if (value > highest) highest = value;
                }
                score.ignored = false;
            });

            if (lowest < 99999) {
                setSingleScoreToIgnoredFailsafe(
                    scores.filter(function(score) {
                        return toFloat(score.value) === lowest;
                    }),
                );
            }

            if (highest > -99999) {
                setSingleScoreToIgnoredFailsafe(
                    scores.filter(function(score) {
                        return toFloat(score.value) === highest && !score.ignored;
                    }),
                );
            }
        };

        var updateShowIngoredScores = function(resultList) {
            if (!resultList) return resultList;
            resultList.forEach(function(entry, index) {
                entry.showIgnoredScores = false;
                if (index > 0) {
                    if (resultList[index - 1].totalScore == entry.totalScore) {
                        resultList[index - 1].showIgnoredScores = true;
                        entry.showIgnoredScores = true;
                    }
                }
            });
        };

        var generateGroupResultList = function(groupParticipants, event) {
            if (!groupParticipants || !groupParticipants.length) return [];
            var result = groupParticipants
                .filter(function(groupParticipant) {
                    return Array.isArray(groupParticipant.scores) && groupParticipant.scores.length > 0 && groupParticipant.scores[0].value !== '';
                })
                .map(function(groupParticipant) {
                    var participant = that.getParticipant(event, groupParticipant.id);
                    return {
                        name: participant.name,
                        slam: participant.slam,
                        participantId: participant.id,
                        ignoredScores: groupParticipant.scores.filter(function(score) {
                            return score.ignored;
                        }),
                        totalScore: groupParticipant.totalScore,
                        secondTotalScore: groupParticipant.secondTotalScore,
                        thirdTotalScore: groupParticipant.thirdTotalScore,
                        extraScore: groupParticipant.extraScore,
                    };
                });

            return result;
        };

        var markWinners = function(resultList, winners) {
            if (!winners || !resultList) return resultList;
            for (var winnerCount = 1; winnerCount <= winners; winnerCount++) {
                if (resultList[winnerCount - 1]) {
                    resultList[winnerCount - 1].state = 'highlight';
                }
            }
            // handle point equality
            if (
                resultList[winners] &&
                resultList[winners].secondTotalScore == resultList[winners - 1].secondTotalScore &&
                resultList[winners].thirdTotalScore == resultList[winners - 1].thirdTotalScore
            ) {
                var pointEquality = resultList[winners].thirdTotalScore;
                resultList
                    .filter(function(resultEntry) {
                        return resultEntry.thirdTotalScore == pointEquality;
                    })
                    .forEach(function(resultEntry) {
                        resultEntry.state = '';
                    });
            }
            return resultList;
        };

        var addExtraScore = function(extraScore, score) {
            if (!extraScore) return score;
            return toFloat(score) + toFloat(extraScore);
        };

        var sortByScore = function(a, b) {
            var result = b.totalScore - a.totalScore;
            if (result === 0) {
                result = b.secondTotalScore - a.secondTotalScore;
            }
            if (result === 0) {
                result = b.thirdTotalScore - a.thirdTotalScore;
            }
            return result;
        };

        var generateWinnerList = function(event, competition) {
            var fixedWinnerList = [];
            var variableWinnerList = [];
            if (competition.groups) {
                competition.groups.forEach(function(group) {
                    var groupResultList = generateGroupResultList(group.participants, event);
                    groupResultList.sort(sortByScore);
                    var fixedWinnersOfGroup = groupResultList.slice(0, competition.fixedWinnersPerGroup);
                    fixedWinnersOfGroup.forEach(function(resultEntry) {
                        resultEntry.slam = 'Gewinner*in ' + group.name;
                    });
                    fixedWinnerList = fixedWinnerList.concat(fixedWinnersOfGroup);
                    var variableWinnersOfGroup = groupResultList.slice(
                        competition.fixedWinnersPerGroup,
                        competition.acrossGroupsWinners + competition.fixedWinnersPerGroup,
                    );
                    variableWinnersOfGroup.forEach(function(resultEntry) {
                        resultEntry.slam = groupResultList.indexOf(resultEntry) + 1 + '. Platz ' + group.name;
                    });
                    variableWinnerList = variableWinnerList.concat(variableWinnersOfGroup);
                });
            }
            fixedWinnerList.sort(sortByScore);
            variableWinnerList.sort(sortByScore);
            updateShowIngoredScores(fixedWinnerList);
            updateShowIngoredScores(variableWinnerList);
            var resultList = fixedWinnerList.concat(variableWinnerList);
            updateShowIngoredScores(resultList);
            resultList = markWinners(resultList, competition.winners);
            return resultList;
        };

        var generateResultList = function(groupParticipants, event, competition, doMarkWinners) {
            var result = generateGroupResultList(groupParticipants, event);
            // highlight
            if (result.length <= 0) return result;
            if (doMarkWinners) {
                result.sort(sortByScore);
                updateShowIngoredScores(result);
                result = markWinners(result, competition.fixedWinnersPerGroup);
            }
            return result;
        };

        var updateWinnerProperties = function(competition) {
            competition.acrossGroupsWinners = competition.winners % competition.groups.length;
            competition.fixedWinnersPerGroup = (competition.winners - competition.acrossGroupsWinners) / competition.groups.length;
        };

        var updateGroupParticipant = function(cGroupParticipant, enableIgnoredScores) {
            if (Array.isArray(cGroupParticipant.scores)) {
                cGroupParticipant.scores.forEach(function(score) {
                    if (score.value) score.value = score.value.replace(/,/, '.');
                });
                if (cGroupParticipant.extraScore) {
                    cGroupParticipant.extraScore = cGroupParticipant.extraScore.replace(/,/, '.');
                }
                that.markIgnoredScores(cGroupParticipant.scores);
                cGroupParticipant.totalScore = that.sumScore(cGroupParticipant.scores);
                cGroupParticipant.secondTotalScore = enableIgnoredScores ? that.sumScoreSecond(cGroupParticipant.scores) : cGroupParticipant.totalScore;
                cGroupParticipant.thirdTotalScore = addExtraScore(cGroupParticipant.extraScore, cGroupParticipant.secondTotalScore);
            }
        };

        var generatePresentation = function(event, previousPresentation) {
            if (!event || !event.view) return $q.reject('no event');

            var competition = that.getCompetition(event, event.view.competitionId);
            var group = that.getGroup(competition, event.view.groupId);
            var participant = that.getParticipant(event, event.view.participantId);
            var groupParticipant = that.getGroupParticipant(group, event.view.participantId);
            if (competition && Object.keys(competition).length > 0) competition.winners = parseInt(competition.winners, 10);
            var result = {
                competitionName: competition.name,
                groupName: group.name,
                participant: participant,
                screen: event.view.screen,
                phase: event.view.phase,
                bgVideo: event.view.bgVideo,
                startVideoAt: event.view.startVideoAt,
                winnersToShow: event.view.winnersToShow,
                enableIgnoredScores: event.view.enableIgnoredScores,
                customText: event.view.customText,
                customTextSubline: event.view.customTextSubline,
            };

            if (competition && Object.keys(competition).length > 0) {
                updateWinnerProperties(competition);
            }
            if (competition && competition.groups) {
                competition.groups.forEach(function(cGroup) {
                    if (cGroup.participants) {
                        cGroup.participants.forEach(function(cgParticipant) {
                            updateGroupParticipant(cgParticipant, event.view.enableIgnoredScores);
                        });
                    }
                    if (cGroup.sacrifice) {
                        updateGroupParticipant(cGroup.sacrifice, event.view.enableIgnoredScores);
                    }
                });
            }

            if (groupParticipant) {
                result.scores = groupParticipant.scores;
                result.totalScore = groupParticipant.totalScore;
                result.secondTotalScore = groupParticipant.secondTotalScore;
            }

            if (group.participants) {
                result.resultList = generateResultList(group.participants, event, competition, event.view.phase === 'winners');
            }

            if (competition && Object.keys(competition).length > 0) {
                result.winnerList = generateWinnerList(event, competition);
                result.showWinnersInReverseOrder = competition.acrossGroupsWinners ? true : false;
            }

            var promises = [];
            if (event.view.bgVideo && event.bgVideos && event.bgVideos[event.view.bgVideo]) {
                promises.push(
                    FileService.getObjectUrl(event.bgVideos[event.view.bgVideo].id).then(function(objectUrl) {
                        result.bgVideoUrl = objectUrl;
                    }),
                );
            }
            if (event.view.video) {
                promises.push(
                    FileService.getObjectUrl(event.view.video).then(function(objectUrl) {
                        result.videoUrl = objectUrl;
                    }),
                );
            }

            return $q.all(promises).then(function() {
                return result;
            });
        };

        var previousPresentation = {};
        this.updatePresentation = function(event) {
            return generatePresentation(event, previousPresentation)
                .then(function(presentation) {
                    if (presentation) {
                        StorageService.setItem('presentation', presentation)
                            .then(function() {
                                previousPresentation = presentation;
                                console.log('persisted presentation');
                            })
                            .catch(function(e) {
                                console.trace(e.stack);
                                console.error('failed to persist presentation');
                            });
                    }
                    return presentation;
                })
                .catch(function(e) {
                    console.error('error updating presentation');
                    if (e && e.stack) {
                        console.trace(e.stack);
                    }
                });
        };

        this.generateWinnerList = generateWinnerList;
        this.generateResultList = generateResultList;

        return this;
    });
})();
(function() {
    'use strict';

    angular.module('psadmin').controller('PresentationCtrl', function($scope, event, PresentationService) {
        $scope.event = event;

        $scope.playBgVideo = function(type) {
            if ($scope.event.bgVideos && $scope.event.bgVideos[type]) {
                $scope.event.view.bgVideo = type;
                $scope.updatePresentation();
            }
        };

        $scope.reset = function() {
            $scope.playBgVideo('pause');
        };

        $scope.resetGroup = function() {
            $scope.playBgVideo('pause');
            $scope.event.view.groupId = null;
            $scope.event.view.participantId = null;
            $scope.updatePresentation();
        };

        $scope.setScreen = function(screenName, phase) {
            $scope.event.view.screen = screenName;
            $scope.event.view.phase = phase;
            $scope.event.view.bgVideo = 'bg';
            $scope.updatePresentation();
        };

        $scope.showGroupWinners = function() {
            $scope.event.view.winnersToShow = 0;
            $scope.setScreen('groupRatings', 'winners');
        };

        $scope.showCompetitionWinners = function() {
            $scope.event.view.winnersToShow = 0;
            $scope.setScreen('competitionRatings');
        };

        $scope.increaseWinnerCount = function() {
            $scope.event.view.winnersToShow++;
            $scope.updatePresentation();
        };

        $scope.getCompetition = function() {
            return PresentationService.getCompetition($scope.event, $scope.event.view.competitionId);
        };

        $scope.getGroup = function() {
            return PresentationService.getGroup($scope.getCompetition(), $scope.event.view.groupId);
        };

        $scope.getGroupParticipant = function() {
            return PresentationService.getGroupParticipant($scope.getGroup(), $scope.event.view.participantId);
        };

        $scope.getScores = function() {
            var groupParticipant = $scope.getGroupParticipant();
            if (!groupParticipant) {
                return [];
            }
            var scores = groupParticipant.scores;
            if (!scores) {
                scores = [];
                groupParticipant.scores = scores;
            }
            if (scores.length < $scope.getCompetition().jurors) {
                for (var i = scores.length + 1; i <= $scope.getCompetition().jurors; i++) {
                    scores.push({
                        value: ''
                    });
                }
            }
            if (scores.length > $scope.getCompetition().jurors) {
                scores = scores.slice(0, $scope.getCompetition().jurors - 1);
                groupParticipant.scores = scores;
            }
            return scores;
        };

        $scope.$watch('selectedTabIndex', function(tabIndex) {
            var competition = $scope.getCompetition();
            if (tabIndex === 4) {
                if (!competition) $scope.winnerList = [];
                else $scope.winnerList = PresentationService.generateWinnerList($scope.event, competition);
            } else if (tabIndex === 3) {
                var group = $scope.getGroup();
                if (!competition || !group) $scope.groupResultList = [];
                else $scope.groupResultList = PresentationService.generateResultList(group.participants, $scope.event, competition, true);
            }
        });

        $scope.updatePresentation = function() {
            PresentationService.updatePresentation($scope.event);
        };
        $scope.updatePresentation();
    });
})();
(function() {
    'use strict';
    angular.module('psadmin').directive('sidenavEntry', function($location) {
        return {
            restrict: 'E',
            scope: true,
            template: '<md-button class="text-left" href="admin.html#{{path}}" ng-class="{\'md-primary\': isActive()}">{{getLabel()}}</md-button>',
            link: function(scope, element, attrs) {
                scope.path = scope.$eval(attrs.path);
                scope.getLabel = function() {
                    return scope.$eval(attrs.label);
                };
                scope.isActive = function() {
                    return $location.path() == scope.path;
                };
            },
        };
    });
})();
(function() {
    'use strict';

    angular.module('psadmin').run(function($rootScope, SyncService) {
        $rootScope.$watch(
            'event',
            function(event) {
                SyncService.persistScope(event);
            },
            true,
        );
    });
})();
(function() {
    'use strict';

    var currentVersion = '1.1.5';

    var getAppCacheStatus = function() {
        var appCache = window.applicationCache;

        switch (appCache.status) {
            case appCache.UNCACHED: // UNCACHED == 0
                return 'Fehler';
                break;
            case appCache.IDLE: // IDLE == 1
                return 'OK';
                break;
            case appCache.CHECKING: // CHECKING == 2
                return 'Prüfe ...';
                break;
            case appCache.DOWNLOADING: // DOWNLOADING == 3
                return 'Download läuft ...';
                break;
            case appCache.UPDATEREADY: // UPDATEREADY == 4
                return 'Update verfügbar';
                break;
            case appCache.OBSOLETE: // OBSOLETE == 5
                return 'Veraltet';
                break;
            default:
                return 'Unbekannt';
                break;
        }
    };

    var offerReload = false;

    window.addEventListener(
        'load',
        function() {
            window.applicationCache.addEventListener(
                'updateready',
                function() {
                    console.log('UPDATE READY');
                    offerReload = true;
                    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
                        console.log('UPDATE READY CHECK');
                        // Browser downloaded a new app cache.
                        // Swap it in and reload the page to get the new hotness.
                    } else {
                        // Manifest didn't changed. Nothing new to server.
                    }
                },
                false,
            );
        },
        false,
    );

    angular.module('psadmin').controller('AboutCtrl', function($scope, $interval, env) {
        $scope.isWeb = env.runtime === 'web';

        $scope.reload = function() {
            window.location.reload(true);
        };

        $scope.appCache = {
            status: getAppCacheStatus(),
            version: currentVersion,
            offerReload: offerReload,
        };

        if ($scope.isWeb) {
            $interval(function() {
                $scope.appCache.status = getAppCacheStatus();
                $scope.appCache.offerReload = offerReload;
            }, 5000);
        }
    });
})();
/**
 * Created by moritz on 14/07/16.
 */
(function() {
    'use strict';

    angular.module('psadmin').controller('AdministrationInterfaceCtrl', function($scope, $mdToast, StorageService) {
        var self = this;
        
        // Default settings
        var defaultSettings = {
            backgroundMode: 'cover',
            customBackgroundUrl: null,
            customBackgroundName: null
        };
        
        // Initialize settings
        $scope.settings = angular.copy(defaultSettings);
        $scope.isLoading = false;
        $scope.backgroundModes = [
            { value: 'cover', label: 'Cover (Fill entire window, may crop)' },
            { value: 'contain', label: 'Contain (Fit entire image, may show borders)' }
        ];

        // Load current settings
        function loadSettings() {
            $scope.isLoading = true;
            StorageService.getItem('presentationSettings').then(function(saved) {
                if (saved) {
                    $scope.settings = angular.extend({}, defaultSettings, saved);
                } else {
                    $scope.settings = angular.copy(defaultSettings);
                }
                $scope.isLoading = false;
                applySettings();
            }).catch(function(error) {
                console.error('Failed to load settings:', error);
                $scope.settings = angular.copy(defaultSettings);
                $scope.isLoading = false;
            });
        }

        // Save settings
        $scope.saveSettings = function() {
            $scope.isLoading = true;
            
            StorageService.setItem('presentationSettings', $scope.settings).then(function() {
                $scope.isLoading = false;
                applySettings();
                showToast('Settings saved successfully!', 'success');
            }).catch(function(error) {
                console.error('Failed to save settings:', error);
                $scope.isLoading = false;
                showToast('Failed to save settings: ' + error.message, 'error');
            });
        };

        // Reset to defaults
        $scope.resetSettings = function() {
            if (confirm('Are you sure you want to reset all presentation settings to defaults?')) {
                $scope.settings = angular.copy(defaultSettings);
                $scope.saveSettings();
                showToast('Settings reset to defaults', 'success');
            }
        };

        // Apply settings to presentation
        function applySettings() {
            // Remove existing dynamic styles
            var existingStyle = document.getElementById('presentation-dynamic-styles');
            if (existingStyle) {
                existingStyle.remove();
            }

            // Create new style element
            var style = document.createElement('style');
            style.id = 'presentation-dynamic-styles';
            style.type = 'text/css';

            var css = '';

            // Background mode and custom background
            css += '.screen-container { ';
            css += 'background-size: ' + $scope.settings.backgroundMode + ' !important; ';
            
            if ($scope.settings.customBackgroundUrl) {
                css += 'background-image: url("' + $scope.settings.customBackgroundUrl + '") !important; ';
            }
            

            
            css += '}';

            style.innerHTML = css;
            document.head.appendChild(style);

            console.log('🎨 Applied presentation settings:', $scope.settings);
        }

        // Validate image file
        function validateImageFile(file) {
            return new Promise(function(resolve, reject) {
                // Check file type
                var allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
                if (allowedTypes.indexOf(file.type) === -1) {
                    reject(new Error('Invalid file type. Please upload PNG, JPEG, or WebP images only.'));
                    return;
                }

                // Check file size (max 10MB)
                if (file.size > 10 * 1024 * 1024) {
                    reject(new Error('File too large. Maximum size is 10MB.'));
                    return;
                }

                // Check image dimensions
                var img = new Image();
                img.onload = function() {
                    if (img.width < 1920 || img.height < 1080) {
                        reject(new Error('Image too small. Minimum dimensions: 1920×1080 pixels. Your image: ' + img.width + '×' + img.height));
                        return;
                    }
                    resolve({
                        width: img.width,
                        height: img.height,
                        valid: true
                    });
                };
                img.onerror = function() {
                    reject(new Error('Invalid image file or corrupted.'));
                };
                img.src = URL.createObjectURL(file);
            });
        }

        // Handle background image upload
        $scope.uploadBackground = function(file) {
            if (!file) return;

            $scope.isLoading = true;
            
            validateImageFile(file).then(function(validation) {
                // Create data URL for the image
                var reader = new FileReader();
                reader.onload = function(e) {
                    $scope.settings.customBackgroundUrl = e.target.result;
                    $scope.settings.customBackgroundName = file.name;
                    
                    // Auto-save when image is uploaded
                    $scope.saveSettings();
                    
                    showToast('Background image uploaded successfully! (' + validation.width + '×' + validation.height + ')', 'success');
                    $scope.$apply();
                };
                reader.onerror = function() {
                    $scope.isLoading = false;
                    showToast('Failed to read image file', 'error');
                    $scope.$apply();
                };
                reader.readAsDataURL(file);
                
            }).catch(function(error) {
                $scope.isLoading = false;
                showToast('Image validation failed: ' + error.message, 'error');
                $scope.$apply();
            });
        };

        // Remove custom background
        $scope.removeBackground = function() {
            if (confirm('Remove custom background and revert to default?')) {
                $scope.settings.customBackgroundUrl = null;
                $scope.settings.customBackgroundName = null;
                $scope.saveSettings();
                showToast('Custom background removed', 'success');
            }
        };



        // Preview settings (apply without saving)
        $scope.previewSettings = function() {
            applySettings();
            showToast('Preview applied! Save to make permanent.', 'info');
        };

        // Trigger file upload
        $scope.triggerUpload = function() {
            document.getElementById('backgroundUpload').click();
        };

        // Utility function to show toast messages
        function showToast(message, type) {
            var config = {
                template: '<md-toast><span class="md-toast-text">' + message + '</span></md-toast>',
                hideDelay: 3000,
                position: 'bottom right'
            };
            
            $mdToast.show(config);
        }

        // Initialize
        loadSettings();
    });
})();
//create UI Button to download all of the content stored in localStorage
(function() {
    'use strict';
    angular.module('psadmin').directive('downloadLocalStorage', function(FileSaver, Blob, StorageService) {
        return {
            restrict: 'E',
            scope: true,
            template: '<md-button class="md-secondary md-raised" ng-click="click()">Akutelle Veranstaltung herunterladen</md-button>',
            controller: function($scope) {
                $scope.click = function() {
                    StorageService.getItem('event').then(function(event) {
                        event = JSON.stringify(event);
                        var data = new Blob([event], {
                            type: 'application/json;charset=utf-8'
                        });
                        FileSaver.saveAs(data, 'PoetryBackup.json');
                    });
                };
            },
        };
    });
})();

//create UI Button to upload a file that overrides all of the content stored in localStorage
//TODO: handle wrong files, project should crash on pdf file and throw error msg

(function() {
    'use strict';
    angular.module('psadmin').directive('uploadLocalStorage', function(FileSaver, Blob, StorageService, SyncService) {
        return {
            restrict: 'E',
            scope: true,
            template: '<form name="form">' +
                '<md-button class="md-secondary md-raised" ngf-select ng-model="file" name="file">Datei auswählen</md-button>' +
                '<md-button class="md-secondary md-raised" type="submit" ng-click="submit()">Bestätigen</md-button>' +
                '</form>',
            controller: function($scope) {
                $scope.submit = function() {
                    var filereader = new FileReader();
                    filereader.onload = function(event) {
                        StorageService.setItem('event', JSON.parse(event.target.result))
                            .then(SyncService.updateEventScope)
                            .then(function() {
                                console.log('upload successful');
                            })
                            .catch(function(err) {
                                console.log('err: ' + err);
                            });
                    };
                    filereader.readAsText($scope.file);
                };
            },
        };
    });
})();

(function() {
    'use strict';

    angular.module('psadmin').service('csvExportService', function($rootScope, Blob, FileSaver) {
        this.exportCSV = function(competitionId) {
            var e = $rootScope.event;

            var competition = null;
            var matchingCompetitionKeys = Object.keys(e.competitions).filter(function(key) {
                return e.competitions[key].id == competitionId;
            });
            if (matchingCompetitionKeys && matchingCompetitionKeys.length === 1) {
                competition = e.competitions[matchingCompetitionKeys[0]];
            }
            if (competition === null) {
                return false;
            }

            var content = '';

            var append = function(value) {
                content += '"' + value + '";';
            };

            append('group');
            append('name');
            append('slam');
            for (var i = 1; i <= competition.jurors; i++) {
                append('score' + i);
            }
            append('ignoredScore1');
            append('ignoredScore2');
            append('extraScore');
            append('totalScore');
            append('totalScoreWithIgnoredScore');
            append('totalScoreWithIgnoredScoreAndExtraScore');
            content += '\n';

            competition.groups.forEach(function(group) {
                group.participants.forEach(function(participant) {
                    console.log(participant);
                    e.participants.forEach(function(p) {
                        if (p.id == participant.id) {
                            append(group.name);
                            append(p.name);
                            append(p.slam);
                            participant.scores.forEach(function(score) {
                                append(score.value);
                            });
                            participant.scores.forEach(function(score) {
                                if (score.ignored) {
                                    append(score.value);
                                }
                            });
                            append(participant.extraScore);
                            append(participant.totalScore);
                            append(participant.secondTotalScore);
                            append(participant.thirdTotalScore);
                            content += '\n';
                        }
                    });
                });
            });

            var blob = new Blob([content], {
                type: 'text/csv;charset=utf-8'
            });
            FileSaver.saveAs(blob, competition.name + '-scores.csv');
        };

        return this;
    });
})();

(function() {
    'use strict';
    angular.module('psadmin').directive('csvExport', function(csvExportService) {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'modules/admin/partials/csvExport.html',
            controller: function($scope) {
                $scope.export = function(id) {
                    csvExportService.exportCSV(id);
                };
            },
        };
    });
})();

/**
 * Created by moritz on 20/08/16.
 */
(function() {
    'use strict';
    angular.module('psadmin').directive('soundPad', function() {
        return {
            restrict: 'E',
            scope: true,
            template: '<audio controls id="media-audio"></audio>' +
                '<div layout="row" layout-wrap> <div ng-repeat="file in soundFileList track by $index"><div flex="33">' +
                '<md-button ng-class="{\'md-raised\':file.active == true}" ng-click="toggle($index)">{{soundFileList[$index].name}}</md-button>' +
                '</div></div></div><md-button ng-click="stop()"><md-icon md-svg-icon="av:stop"></md-icon></md-button>' +
                '<md-progress-linear id="progress-bar" md-mode="determinate" value="{{determinateValue}}"></md-progress-linear>',
            link: function(scope) {
                var mediaPlayer;
                mediaPlayer = document.getElementById('media-audio');
                //mediaPlayer.controls = true;
                console.log('TEST');
                scope.soundFileList = scope.$root.event.files.audio;
                //play or stop function
                scope.toggle = function(index) {
                    var i;
                    for (i = 0; i < scope.soundFileList.length; i++) {
                        scope.soundFileList[i].active = false;
                    }
                    mediaPlayer.currentTime = 0;
                    mediaPlayer.src = scope.soundFileList[index].url;
                    scope.soundFileList[index].active = true;
                    mediaPlayer.load();
                    mediaPlayer.play();
                };
                mediaPlayer.addEventListener('timeupdate', updateProgressBar, false);

                function updateProgressBar() {
                    scope.determinateValue = Math.floor((100 / mediaPlayer.duration) * mediaPlayer.currentTime);
                    scope.$apply();
                }

                scope.stop = function() {
                    mediaPlayer.pause();
                    mediaPlayer.currentTime = 0;
                };
            },
        };
    });
})();
(function() {
    'use strict';
    angular.module('psadmin').directive('mediaPanel', function($mdDialog, PresentationService, FileService) {
        return {
            restrict: 'E',
            templateUrl: './modules/admin/partials/mediaPanel.html',
            scope: true,
            link: function(scope) {
                scope.event = scope.$root.event;
                scope.setScreen = scope.$parent.setScreen;
                scope.selected = {};

                // Movies
                scope.playBgVideo = function(type) {
                    if (scope.event.bgVideos && scope.event.bgVideos[type]) {
                        scope.event.view.bgVideo = type;
                        PresentationService.updatePresentation(scope.event);
                    }
                };

                scope.playClip = function(video) {
                    scope.event.view.video = video.id;
                    scope.event.view.startVideoAt = Date.now();
                    PresentationService.updatePresentation(scope.event);
                };

                scope.stopClip = function() {
                    scope.event.view.video = null;
                    scope.event.view.startVideoAt = Date.now();
                    PresentationService.updatePresentation(scope.event);
                };

                // Sounds
                scope.playSound = function(sound) {
                    if (sound !== scope.event.sound) {
                        scope.event.sound = sound;
                        scope.$root.$emit('sound.change');
                    }
                    scope.event.soundState = 'play';
                    scope.$root.$emit('sound.play');
                };

                scope.pauseSound = function(sound) {
                    scope.event.soundState = 'pause';
                    scope.$root.$emit('sound.pause');
                };

                scope.stopSound = function() {
                    scope.event.sound = null;
                    scope.event.soundState = 'pause';
                    scope.$root.$emit('sound.change');
                };
            },
        };
    });
})();

(function() {
    'use strict';
    angular.module('psadmin').directive('provideParticipant', function(PresentationService) {
        return {
            restrict: 'A',
            scope: false,
            link: function(scope, element, attrs) {
                scope.$watch(attrs['provideParticipant'], function(participantId) {
                    var competition = scope.getCompetition();
                    scope.participant = PresentationService.findGroupParticipant(competition, participantId);
                });
            },
        };
    });
})();
(function() {
    'use strict';

    angular.module('ps.sync', []);
})();
(function() {
    'use strict';

    angular.module('ps.sync').service('SyncService', function($rootScope, StorageService) {
        this.updatePresentationScope = function() {
            return StorageService.getItem('presentation')
                .then(function(presentation) {
                    if (presentation) {
                        $rootScope.presentation = presentation;
                        console.log('updated presentation', $rootScope.presentation);
                    } else {
                        $rootScope.presentation = {};
                        console.log('initialized presentation');
                    }
                })
                .catch(function(e) {
                    console.trace(e.stack);
                    console.error('failed to get presentation from storage');
                });
        };

        this.updateEventScope = function() {
            return StorageService.getItem('event')
                .then(function(event) {
                    if (event) {
                        $rootScope.event = event;
                        console.log('updated event ', event);
                    } else {
                        $rootScope.event = {
                            participants: [],
                            competitions: [],
                            view: {},
                        };
                    }
                })
                .catch(function(e) {
                    console.trace(e.stack);
                    console.error('failed to get event from storage');
                });
        };

        this.persistScope = function(event) {
            if (event) {
                StorageService.setItem('event', event)
                    .then(function() {
                        console.log('persisted scope');
                    })
                    .catch(function(e) {
                        console.trace(e.stack);
                        console.error('failed to set event in storage');
                    });
            }
        };

        return this;
    });
})();
(function() {
    'use strict';

    /**
     * @namespace ps.storage
     */

    angular.module('ps.storage', []).constant('env', {
        runtime: window.chrome && chrome.runtime && chrome.runtime.id ? 'chrome' : 'web',
    });
})();
(function(angular) {
    'use strict';

    /**
     * @namespace ps.storage.models
     */

    angular.module('ps.storage').service('Models', function() {
        var models = {};

        /**
         * Represents a participant, a natural person
         * @constructor
         * @param {guid} id - Guid to idendifiy a participant
         * @param {string} name - name of the participant e.G. Marc Dieter Kling
         * @param {string} slam - slam where the participant came from
         * @param {string} gender - a character that indicates the gender (could be w or m or undefined)
         */
        models.participant = function(id, name, slam, gender) {
            /** {GUID}  */
            this.id = id;
            this.name = name;
            this.slam = slam;
            this.gender = gender;
        };

        /**
         * Represents a competition, normaly a competition represents a event e.G. Finlas or Pre-Finals
         * @constructor
         * @param {guid} id - Guid to idendifiy a competition
         * @param {string} name - name of the competition e.G. slam2016 Finale
         * @param {number} jurors - count of the jurors
         * @param {number} winners -
         */
        models.competition = function(id, name, jurors, winners, acrossGroupsWinners, fixedWinnersPerGroup) {
            this.id = id;
            this.name = name;
            this.jurors = jurors;
            this.winners = winners;
            this.acrossGroupsWinners = acrossGroupsWinners;
            this.fixedWinnersPerGroup = fixedWinnersPerGroup;
        };

        models.group = function() {
            this.id = id;
            this.name = name;
            this.participants = participants;
            this.sacrifice = sacrifice;
        };

        /**
         * Represents a audio or video-file
         * @constructor
         * @param {string} name -
         */
        models.file = function(id, name, file, entry, objectUrl) {
            this.name = name;
            this.$file = file;
            this.$entry = entry;
            this.id = id;
            this.$objectUrl = objectUrl;
            this.isBackground = false;
            this.isPause = false;
        };

        return models;
    });
})(angular);
(function(angular) {
    'use strict';

    angular
        .module('ps.storage')
        .service('StorageService', function(env, ChromeStorageService, LocalStorageService) {
            var storage = null;

            if (env.runtime == 'chrome') {
                storage = ChromeStorageService;
            } else if (env.runtime == 'web') {
                storage = LocalStorageService;
            } else {
                console.log('unkown storage type found. is not chrome or web. please add in StorageService.js');
                throw new Error('unkown storage type found. is not chrome or web. please add in StorageService.js');
            }

            return storage;
        })
        .service('ChromeStorageService', function($q) {
            var getStore = function() {
                return chrome.storage.local;
            };

            this.getAll = function() {
                return $q(function(resolve) {
                    getStore().get(null, function(values) {
                        resolve(values);
                    });
                });
            };

            this.getItem = function(key) {
                return $q(function(resolve) {
                    getStore().get(key, function(value) {
                        resolve(value[key]);
                    });
                });
            };

            this.setItem = function(key, value) {
                return $q(function(resolve) {
                    var obj = {};
                    obj[key] = value;
                    getStore().set(obj, function() {
                        resolve();
                    });
                });
            };

            this.removeItem = function(key) {
                return $q(function(resolve) {
                    getStore().remove(key, function() {
                        resolve();
                    });
                });
            };

            this.clear = function() {
                return $q(function(resolve, reject) {
                    getStore().clear(function() {
                        // check if store is clear
                        getStore().get(function(result) {
                            if (Object.keys(result) > 0) {
                                // if result is not an empty object
                                reject();
                            } else {
                                // result is an empty object
                                resolve();
                            }
                        });
                    });
                });
            };

            this.onChange = function(callback) {
                chrome.storage.onChanged.addListener(callback);
            };
        })
        .service('LocalStorageService', function($window, $q) {
            this.getItem = function(key) {
                return $q(function(resolve) {
                    resolve(angular.fromJson($window.localStorage.getItem(key)));
                });
            };
            this.getAll = function() {
                return $q(function(resolve) {
                    var arrayToReturn = [];
                    for (var i = 0, len = localStorage.length; i < len; ++i) {
                        arrayToReturn.push(localStorage.getItem(localStorage.key(i)));
                    }
                    resolve(arrayToReturn);
                });
            };
            this.setItem = function(key, value) {
                return $q(function(resolve) {
                    console.log('setItem called');
                    $window.localStorage.setItem(key, angular.toJson(value));
                    resolve();
                });
            };

            this.removeItem = function(key) {
                return $q(function(resolve) {
                    $window.localStorage.removeItem(key);
                    resolve();
                });
            };

            this.clear = function() {
                return $q(function(resolve) {
                    $window.localStorage.clear();
                    resolve();
                });
            };

            this.onChange = function(callback) {
                $window.addEventListener('storage', callback);
            };
        });
})(angular);
(function(angular) {
    'use strict';

    angular
        .module('ps.storage')
        .service('FileService', function(env, ChromeFileService, WebFileService) {
            var services = [ChromeFileService, WebFileService];
            var supportedServices = services.filter(function(service) {
                return service.supportsRuntime(env.runtime);
            });
            if (supportedServices.length <= 0) throw new Error('no file service found');

            supportedServices[0].setup();
            return supportedServices[0];
        })
        .service('ChromeFileService', function($q) {
            var objectUrlCache = {};

            this.supportsRuntime = function(runtime) {
                return runtime === 'chrome';
            };

            this.setup = function() {
                // nothing to do
            };

            this.isRecoverable = function() {
                return true;
            };

            this.askForFiles = function(mimetypes, multiple) {
                return $q(function(resolve, reject) {
                    var options = {
                        type: 'openFile',
                        acceptsMultiple: multiple ? true : false
                    };
                    if (mimetypes) {
                        options.accepts = [{
                            mimeTypes: [mimetypes]
                        }];
                    } else {
                        options.acceptsAllTypes = true;
                    }
                    chrome.fileSystem.chooseEntry(options, function(entries) {
                        if (!entries) reject();
                        var entriesArray = Array.isArray(entries) ? entries : [entries];
                        var publicFileObjs = entriesArray.map(function(entry) {
                            return {
                                id: chrome.fileSystem.retainEntry(entry),
                                name: entry.name,
                            };
                        });
                        resolve(publicFileObjs);
                    });
                });
            };

            this.getObjectUrl = function(id) {
                return $q(function(resolve, reject) {
                    if (objectUrlCache[id]) {
                        resolve(objectUrlCache[id]);
                    } else {
                        chrome.fileSystem.isRestorable(id, function(isRestorable) {
                            try {
                                if (!isRestorable) {
                                    resolve(null);
                                    return;
                                }
                                chrome.fileSystem.restoreEntry(id, function(entry) {
                                    if (chrome.runtime.lastError) {
                                        console.log('Fehler: ' + chrome.runtime.lastError);
                                        resolve(null);
                                    } else {
                                        if (entry) {
                                            entry.file(function(file) {
                                                objectUrlCache[id] = URL.createObjectURL(file);
                                                resolve(objectUrlCache[id]);
                                            });
                                        } else {
                                            console.log('Could not restore entry');
                                            resolve(null);
                                        }
                                    }
                                });
                            } catch (ex) {
                                console.error('Komischer Error' + ex);
                                resolve(null);
                            }
                        });
                    }
                });
            };

            this.remove = function(id) {
                if (objectUrlCache[id]) {
                    URL.revokeObjectURL(objectUrlCache[id]);
                    delete objectUrlCache[id];
                }
            };
        })
        .service('WebFileService', function($q) {
            var fileElement;
            var fileCallback;
            var nextId = 1;
            var knownFiles = {};

            var onFileInputChange = function(event) {
                if (!fileCallback) {
                    console.error('no callback for handling of selected files specified');
                    return false;
                }
                var files = event.target.files;
                var publicFileObjs = [];
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    knownFiles[nextId] = window.URL.createObjectURL(file);
                    publicFileObjs.push({
                        id: nextId,
                        name: file.name,
                    });
                    nextId++;
                }
                fileCallback(publicFileObjs);
            };

            this.supportsRuntime = function(runtime) {
                return runtime === 'web';
            };

            this.setup = function() {
                fileElement = document.createElement('input');
                fileElement.setAttribute('type', 'file');
                fileElement.style.display = 'none';
                fileElement.addEventListener('change', onFileInputChange);
                document.body.appendChild(fileElement);
            };

            this.askForFiles = function(mimetypes, multiple) {
                if (mimetypes) {
                    fileElement.setAttribute('accept', mimetypes);
                } else {
                    fileElement.removeAttribute('accept');
                }
                if (multiple) {
                    fileElement.setAttribute('multiple', 'multiple');
                } else {
                    fileElement.removeAttribute('multiple');
                }
                var promise = $q(function(resolve) {
                    fileCallback = resolve;
                });
                fileElement.click();
                return promise;
            };

            this.getObjectUrl = function(id) {
                return $q.resolve(knownFiles[id]);
            };

            this.isRecoverable = function() {
                return false;
            };

            this.remove = function(id) {
                if (knownFiles[id]) {
                    URL.revokeObjectURL(knownFiles[id]);
                    delete knownFiles[id];
                }
            };
        });
})(angular);
(function() {
    'use strict';
    angular.module('ps.storage').directive('dynamicVideo', function(FileService) {
        return {
            restrict: 'E',
            scope: {
                videoId: '=',
            },
            replace: true,
            template: '<div><video></video></div>',
            link: function(scope, element) {
                var videoElement = element[0].querySelector('video');

                scope.$watch('videoId', function() {
                    if (scope.videoId === null || scope.videoId === undefined) {
                        videoElement.src = '';
                    } else {
                        FileService.getObjectUrl(scope.videoId)
                            .then(function(url) {
                                videoElement.src = url;
                            })
                            .catch(function(error) {
                                element[0].classList.add('error');
                                console.error('error resolving ' + scope.videoId, error);
                            });
                    }
                });

                var play = function() {
                    if (videoElement.ended) {
                        videoElement.currentTime = 0;
                    }
                    videoElement.play();
                };
                scope.$on('playVideo', play);
                scope.$on('playSpecificVideo', function(event, id) {
                    if (scope.videoId === id) play();
                });

                var replay = function() {
                    videoElement.currentTime = 0;
                    videoElement.play();
                };
                scope.$on('replayVideo', replay);
                scope.$on('replaySpecificVideo', function(event, id) {
                    if (scope.videoId === id) replay();
                });

                var pause = function() {
                    videoElement.pause();
                };
                scope.$on('pauseVideo', pause);
                scope.$on('pauseSpecificVideo', function(event, id) {
                    if (scope.videoId === id) pause();
                });

                var playPause = function() {
                    if (videoElement.paused) replay();
                    else pause();
                };
                scope.$on('playPauseVideo', playPause);
                scope.$on('playPauseSpecificVideo', function(event, id) {
                    if (scope.videoId === id) playPause();
                });
            },
        };
    });
})();

(function() {
    'use strict';
    angular.module('psadmin').directive('competitionsTab', function() {
        return {
            restrict: 'E',
            scope: false,
            templateUrl: './modules/admin/partials/competitionsTab.html',
            controller: function($scope, $rootScope) {
                $scope.competitionIsSelected = function(competition) {
                    if (competition.id == $rootScope.event.view.competitionId) {
                        return true;
                    } else {
                        return false;
                    }
                };
                $scope.selectCompetition = function(competition) {
                    $rootScope.event.view.competitionId = competition.id;
                    $rootScope.event.view.enableIgnoredScores = competition.enableIgnoredScores;
                };
            },
        };
    });
})();

(function() {
    'use strict';
    angular.module('psadmin').directive('groupsTab', function() {
        return {
            restrict: 'E',
            scope: false,
            templateUrl: './modules/admin/partials/groupsTab.html',
            controller: function($scope, $rootScope) {
                $scope.groupIsSelected = function(group) {
                    if (group.id == $rootScope.event.view.groupId) {
                        return true;
                    } else {
                        return false;
                    }
                };
                $scope.selectGroup = function(group) {
                    $rootScope.event.view.groupId = group.id;
                };
            },
        };
    });
})();

(function() {
    'use strict';
    angular.module('psadmin').directive('participantsTab', function() {
        return {
            restrict: 'E',
            scope: false,
            templateUrl: './modules/admin/partials/participantsTab.html',
            controller: function($scope, $rootScope) {
                $scope.participantIsSelected = function(participant) {
                    if (participant.id == $rootScope.event.view.participantId) {
                        return true;
                    } else {
                        return false;
                    }
                };
                $scope.selectParticipant = function(participant) {
                    $rootScope.event.view.participantId = participant.id;
                };
            },
        };
    });
})();

(function() {
    'use strict';
    angular.module('psadmin').directive('resultsTab', function() {
        return {
            restrict: 'E',
            scope: false,
            templateUrl: './modules/admin/partials/resultsTab.html',
        };
    });
})();

(function() {
    'use strict';
    angular.module('psadmin').directive('endTab', function() {
        return {
            restrict: 'E',
            scope: false,
            templateUrl: './modules/admin/partials/endTab.html',
        };
    });
})();

(function() {
    'use strict';
    angular.module('psadmin').directive('offerPresentationWindow', function(env) {
        return {
            restrict: 'E',
            scope: true,
            template: '<md-button ng-if="isChrome" ng-click="open()">Präsentationsfenster öffnen</md-button>',
            link: function(scope) {
                scope.isChrome = env.runtime === 'chrome';

                scope.open = function() {
                    chrome.app.window.create('index.html', {
                        state: 'maximized',
                        id: 'presentation',
                    });
                };
            },
        };
    });
})();
(function() {
    'use strict';
    angular.module('psadmin').controller('VideoAdminCtrl', function($scope, FileService, PresentationService) {
        if (!Array.isArray($scope.event.videos)) $scope.event.videos = [];
        if (!$scope.event.bgVideos) $scope.event.bgVideos = {};

        $scope.addVideos = function() {
            FileService.askForFiles('video/*', true)
                .then(function(newVideos) {
                    newVideos.forEach(function(video) {
                        $scope.event.videos.push(video);
                    });
                })
                .catch(function(error) {
                    console.trace(error.stack);
                });
        };

        $scope.selectBgVideo = function(name) {
            FileService.askForFiles('video/*', false).then(function(newVideos) {
                if (newVideos.length > 0) {
                    if ($scope.event.bgVideos[name]) FileService.remove($scope.event.bgVideos[name].id);
                    $scope.event.bgVideos[name] = newVideos[0];
                    if ($scope.event.view.bgVideo === name) {
                        PresentationService.updatePresentation($scope.event);
                    }
                }
            });
        };

        $scope.deleteVideo = function(video) {
            $scope.event.videos.splice($scope.event.videos.indexOf(video), 1);
            FileService.remove(video.id);
        };

        $scope.playPause = function(video) {
            $scope.$broadcast('playPauseSpecificVideo', video.id);
        };
    });
})();
(function() {
    'use strict';
    angular.module('psadmin').controller('SoundAdminCtrl', function($scope, FileService) {
        if (!Array.isArray($scope.event.sounds)) $scope.event.sounds = [];

        $scope.addSounds = function() {
            FileService.askForFiles('audio/*', true)
                .then(function(newSounds) {
                    newSounds.forEach(function(video) {
                        $scope.event.sounds.push(video);
                    });
                })
                .catch(function(error) {
                    console.trace(error.stack);
                });
        };

        $scope.deleteSound = function(sound) {
            $scope.event.sounds.splice($scope.event.sounds.indexOf(sound), 1);
            FileService.remove(sound.id);
        };
    });
})();
(function() {
    'use strict';

    var fadeOut = function(audioElement) {
        var maxValue = audioElement.volume;
        var startValue = 1;
        var iterations = 3;
        var iterationCount = 0;

        return new Promise(function(resolve) {
            var intervalObj = setInterval(function() {
                iterationCount++;
                audioElement.volume = Math.max(0, Math.min(maxValue, (startValue / iterations) * (iterations - iterationCount)));
                if (iterationCount >= iterations) {
                    clearInterval(intervalObj);
                    resolve();
                }
            }, 1);
        });
    };

    var fadeIn = function(audioElement) {
        var targetValue = 1;
        var iterations = 3;
        var iterationCount = 0;

        return new Promise(function(resolve) {
            var intervalObj = setInterval(function() {
                iterationCount++;
                audioElement.volume = Math.min(targetValue, (targetValue / iterations) * iterationCount);
                if (iterationCount >= iterations) {
                    clearInterval(intervalObj);
                    resolve();
                }
            }, 1);
        });
    };

    angular.module('psadmin').directive('backgroundAudio', function(FileService) {
        return {
            restrict: 'E',
            scope: true,
            template: '<audio src="" style="display: none;"></audio>',
            link: function(scope, element) {
                var audioElement = element[0].querySelector('audio');
                var currentSound = null;
                var currentPromise = Promise.resolve(true);
                var canPlayThrough = false;

                audioElement.oncanplaythrough = function() {
                    canPlayThrough = true;
                };

                var stop = function() {
                    if (currentSound === null) return Promise.resolve(true);
                    currentSound = null;
                    if (!audioElement.paused) {
                        return fadeOut(audioElement).then(function() {
                            audioElement.pause();
                            audioElement.src = '';
                        });
                    } else {
                        return Promise.resolve(true);
                    }
                };

                var updateSrc = function(sound) {
                    console.log('update audio src');
                    return FileService.getObjectUrl(sound.id).then(function(objectUrl) {
                        if (!objectUrl) return true;

                        currentSound = sound;
                        audioElement.currentTime = 0;
                        canPlayThrough = false;
                        audioElement.src = objectUrl;
                        audioElement.load();

                        return new Promise(function(resolve, reject) {
                            console.log('detect can play');
                            var iterationCount = 0;
                            var canPlayIntervalObj = setInterval(function() {
                                iterationCount++;
                                if (canPlayThrough) {
                                    console.log('can play');
                                    resolve();
                                    clearInterval(canPlayIntervalObj);
                                } else if (iterationCount > 500) {
                                    reject();
                                    clearInterval(canPlayIntervalObj);
                                }
                            }, 10);
                        });
                    });
                };

                scope.$root.$on('sound.change', function() {
                    var sound = scope.$root.event.sound;
                    if (sound == currentSound) return true;
                    console.log('try to change sound');
                    currentPromise = stop().then(function() {
                        console.log('onchange: stopped audio');
                        if (!sound) return true;
                        return updateSrc(sound);
                    });
                });

                scope.$root.$on('sound.play', function() {
                    console.log('try to play audio');
                    currentPromise.then(function() {
                        if (!currentSound) return false;
                        console.log('play audio');
                        audioElement.volume = 0;
                        audioElement.play();
                        fadeIn(audioElement);
                    });
                });

                scope.$root.$on('sound.pause', function() {
                    fadeOut(audioElement).then(function() {
                        audioElement.pause();
                    });
                });
            },
        };
    });
})();
(function() {
    'use strict';
    angular.module('psadmin').directive('audioShortcuts', function() {
        return {
            restrict: 'EA',
            link: function(scope) {
                var onKeyDown = function(e) {
                    if (e.ctrlKey) {
                        if (e.key === 'S' || e.key === 's') {
                            scope.event.sound = null;
                            scope.$root.$emit('sound.change');
                            scope.$apply();
                        } else {
                            var index = parseInt(e.key) - 1;
                            // 1 =^ 0, 2 =^ 1,... and 0 =^ 10  (key =^ soundindex)
                            if (index == -1) {
                                index = 10;
                            }
                            if (!isNaN(index) && index < 11 && Array.isArray(scope.$root.event.sounds) && scope.$root.event.sounds[index]) {
                                var newSound = scope.$root.event.sounds[index];
                                if (scope.$root.event.sound == newSound) {
                                    scope.$root.event.soundState = scope.$root.event.soundState === 'play' ? 'pause' : 'play';
                                    scope.$root.$emit('sound.' + scope.$root.event.soundState);
                                } else {
                                    scope.$root.event.sound = newSound;
                                    scope.$root.$emit('sound.change');
                                    scope.$root.event.soundState = 'play';
                                    scope.$root.$emit('sound.play');
                                }
                                scope.$apply();
                            }
                        }
                    }
                };

                window.addEventListener('keydown', onKeyDown);
                scope.$on('$destroy', function() {
                    window.removeEventListener('keydown', onKeyDown);
                });
            },
        };
    });
})();
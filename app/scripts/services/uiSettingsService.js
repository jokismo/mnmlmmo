'use strict';

angular.module('mudApp.backendServices')

  .factory('uiSettingsService', ['firebaseRef', '$q', function(firebaseRef, $q) {

    return {

      settingsRef : {},

      getSettings: function(isAdmin, uid, factionId, houseId, charId, isMobile) {
        var deferred = $q.defer();
        if(isAdmin) {
          this.settingsRef = firebaseRef(['users', uid, 'admin', 'uiSettings']);
          this.settingsRef.once('value', function(data) {
            deferred.resolve(data.val());
          }, function(error) {
            deferred.reject(error);
          });
        } else {
          if (isMobile) {
            this.settingsRef = firebaseRef(['users', uid, 'houses', factionId, houseId, 'chars', charId, 'uiSettings', 'mobile']);
          } else {
            this.settingsRef = firebaseRef(['users', uid, 'houses', factionId, houseId, 'chars', charId, 'uiSettings', 'currentUi']);
            this.settingsRef.once('value', function(data) {
              deferred.resolve(data.val());
            }, function(error) {
              deferred.reject(error);
            });
          }
        }
        return deferred.promise;
      },

      saveSettings: function(uiSettings) {
        this.settingsRef.set(uiSettings);
      },

      initUser: function(deferred, uid, factionId, houseId, charId, isMobile) {
        var currentRef, marginY, heightY;
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var uiSettings = {
          guiSettings: {
            draggable: true,
            resizable: true,
            snap: true
          },
          battle: {
            show: true
          },
          char: {
            show: true
          },
          chat: {
            show: true
          },
          enemy: {
            show: true
          },
          enemystatus: {
            show: true
          },
          global: {
            show: true
          },
          inv: {
            show: true
          },
          menubar: {
            show: true,
            posX: 'init'
          },
          npcs: {
            show: true
          },
          ownstatus: {
            show: true
          },
          party: {
            show: true
          },
          quests: {
            show: true
          },
          target: {
            show: true
          },
          worldmap: {
            show: true,
            posX: 'init'
          }
        };

        if (isMobile) {
          this.settingsRef = firebaseRef(['users', uid, 'houses', factionId, houseId, 'chars', charId, 'uiSettings', 'mobile']);
        } else {
          this.settingsRef = firebaseRef(['users', uid, 'houses', factionId, houseId, 'chars', charId, 'uiSettings', 'default']);
          currentRef =  firebaseRef(['users', uid, 'houses', factionId, houseId, 'chars', charId, 'uiSettings', 'currentUi']);
          setBroswerUi();
          this.settingsRef.set(uiSettings);
          currentRef.set(uiSettings, function() {
            deferred.resolve(uiSettings);
          });
        }

        function setBroswerUi() {
          if (windowHeight < 855) {
            marginY = (windowHeight * 0.03) | 0;
            heightY = (windowHeight * 0.29) | 0;
          } else {
            marginY = 25;
            heightY = 250;
          }

          var cols = {
            left: ['char', 'inv', 'quests'],
            right: ['global', 'target', 'npcs'],
            status: ['ownstatus', 'enemystatus']
          };

          cols['left'].forEach(function(element, index) {
            uiSettings[element].posY = ((marginY * (index + 1)) + (heightY * index));
            uiSettings[element].sizeY = heightY;
            uiSettings[element].posX = marginY;
            uiSettings[element].sizeX = 250;
          });

          cols['right'].forEach(function(element, index) {
            uiSettings[element].posY = ((marginY * (index + 1)) + (heightY * index));
            uiSettings[element].sizeY = heightY;
            uiSettings[element].posX = windowWidth - 250 - marginY;
            uiSettings[element].sizeX = 250;
          });

          cols['status'].forEach(function(element, index) {
            uiSettings[element].posY = windowHeight - 100 - marginY;
            uiSettings[element].sizeX = 100;
            uiSettings[element].sizeY = 100;
          });

          uiSettings.ownstatus.posX = 250 + (2 * marginY);
          uiSettings.enemystatus.posX = windowWidth - 350 - (2 * marginY);

          uiSettings.party.posY = marginY;
          uiSettings.party.posX = (250 + marginY * 2) + ((windowWidth - 700 - (marginY * 4)));
          uiSettings.party.sizeX = 200;
          uiSettings.party.sizeY = (windowHeight / 2) - marginY;

          uiSettings.chat.sizeY = 150;
          uiSettings.chat.posY = (windowHeight / 2) + marginY;
          uiSettings.chat.sizeX = ((windowWidth - 500 - (marginY * 4)));
          uiSettings.chat.posX = 250 + (2 * marginY);

          uiSettings.battle.sizeY = 250;
          uiSettings.battle.posY = uiSettings.chat.posY + uiSettings.chat.sizeY + marginY;
          uiSettings.battle.sizeX = ((uiSettings.chat.sizeX - marginY) / 3 * 2) | 0;
          uiSettings.battle.posX =  250 + (2 * marginY);

          uiSettings.enemy.sizeY = 250;
          uiSettings.enemy.posY = uiSettings.battle.posY;
          uiSettings.enemy.sizeX = ((uiSettings.chat.sizeX - marginY) / 3) | 0;
          uiSettings.enemy.posX =  uiSettings.battle.posX + uiSettings.battle.sizeX + marginY;

          uiSettings.menubar.posY = windowHeight - marginY - 50;
          uiSettings.worldmap.posY = marginY;
        }
      },

      initAdmin: function(uid) {
        var marginY, heightY;
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var deferred = $q.defer();
        var uiSettings = {
          guiSettings: {
            draggable: true,
            resizable: true,
            snap: true
          },
          users: {
            show: true
          },
          mapeditor: {
            show: true
          },
          gamestatus: {
            show: true
          },
          console: {
            show: true
          },
          adminmap: {
            show: true,
            posX: 'init'
          },
          adminbar: {
            show: true,
            posX: 'init'
          }
        };

        this.settingsRef = firebaseRef(['users', uid, 'admin', 'uiSettings']);
        setBroswerUi();
        this.settingsRef.set(uiSettings, function(error) {
          if (error) {
            deferred.reject(error);
          } else {
            deferred.resolve();
          }
        });

        function setBroswerUi() {
          if (windowHeight < 855) {
            marginY = (windowHeight * 0.03) | 0;
            heightY = (windowHeight * 0.29) | 0;
          } else {
            marginY = 25;
            heightY = 250;
          }

          var cols = {
            left: ['users', 'gamestatus'],
            right: ['mapeditor', 'console']
          };

          cols['left'].forEach(function(element, index) {
            uiSettings[element].posY = ((marginY * (index + 1)) + (heightY * index));
            uiSettings[element].sizeY = heightY;
            uiSettings[element].posX = marginY;
            uiSettings[element].sizeX = 250;
          });

          cols['right'].forEach(function(element, index) {
            uiSettings[element].posY = ((marginY * (index + 1)) + (heightY * index));
            uiSettings[element].sizeY = heightY;
            uiSettings[element].posX = windowWidth - 250 - marginY;
            uiSettings[element].sizeX = 250;
          });

          uiSettings.adminbar.posY = windowHeight - marginY - 50;
          uiSettings.adminmap.posY = marginY;
        }
        return deferred.promise;
    }

    };
  }]);

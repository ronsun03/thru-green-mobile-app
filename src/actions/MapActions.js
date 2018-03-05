import firebase from 'firebase';
import geolib from 'geolib';
import _ from 'lodash';
import axios from 'axios';

import {
  SET_CURRENT_POSITION,
  GET_AREAS,
  IN_CURRENT_AREA,
  IN_CURRENT_SECTOR,
  APP_TOGGLE,
  SET_CURRENT_SPEED
} from './types';

// Initialize other live database
// const liveDBConfig = {
//   apiKey: "AIzaSyAaaYTKixKh49UKu-iUHVQxJPrD03TEySM",
//   authDomain: "thru-green-live-db.firebaseapp.com",
//   databaseURL: "https://thru-green-live-db.firebaseio.com",
//   projectId: "thru-green-live-db",
//   storageBucket: "thru-green-live-db.appspot.com",
//   messagingSenderId: "455601807101"
// };
//
// const liveDB = firebase.initializeApp(liveDBConfig, "liveDB");

export const appToggle = isOn => {
  return (dispatch) => {
    console.log('toggleMap isOn: ', isOn);
    dispatch({
      type: APP_TOGGLE,
      payload: isOn
    });
  };
};

export const pushDataToDB = (region, speed, user) => {
  return (dispatch) => {
    let date = new Date();
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' +
        ('00' + date.getUTCHours()).slice(-2) + ':' +
        ('00' + date.getUTCMinutes()).slice(-2) + ':' +
        ('00' + date.getUTCSeconds()).slice(-2);

    const object = {
      uid: user.uid,
      lat: region.latitude,
      lng: region.longitude,
      speed,
      time: date
    };

    axios.post('http://ec2-18-219-64-185.us-east-2.compute.amazonaws.com:8080/api/push-to-sql', object);
  };
};

export const setCurrentPosition = (region) => {
  return (dispatch) => {
    const testingRef = firebase.database().ref('/testing');

    testingRef.update({
      currentLocation: {
        lat: region.latitude,
        lng: region.longitude
      }
    });

    dispatch({
      type: SET_CURRENT_POSITION,
      payload: region
    });
  };
};

export const setCurrentSpeed = speed => {
  // const testingRef = firebase.database().ref('/testing');
  //
  // testingRef.update({
  //   currentSpeed: speed
  // });

  return {
    type: SET_CURRENT_SPEED,
    payload: speed
  };
};

export const getAreas = () => {
  return (dispatch) => {
    firebase.database().ref('/areas')
    .once('value', snapshot => {
      const areas = snapshot.val();

      dispatch({
        type: GET_AREAS,
        payload: areas
      });
    });
  };
};

export const checkInArea = (currentPosition, user) => {
  console.log('checkInArea');
  return (dispatch) => {
    // Check if there is a currentposition and user logged in
    if (currentPosition && user) {
      const d = new Date();
      let dd = d.getDate();
      let mm = d.getMonth() + 1; //January is 0!
      const yyyy = d.getFullYear();

      if (dd < 10) {
          dd = `0${dd}`;
      }

      if (mm < 10) {
          mm = `0${mm}`;
      }

      const today = `${yyyy}-${mm}-${dd}`;

      console.log('today', today);

      const areaRef = firebase.database().ref('/areas');
      const userRef = firebase.database().ref(`/user/${user.uid}`);
      const appStatsRef = firebase.database().ref(`/appStats/`);

      areaRef.once('value', snapshot => {
        const areas = snapshot.val();
        const areaObject = {};

        // Loop through each area
        _.forEach(areas, (area) => {
          const areaPolygon = [
            { latitude: area.ALat1, longitude: area.ALon1 },
            { latitude: area.ALat1, longitude: area.ALon2 },
            { latitude: area.ALat2, longitude: area.ALon2 },
            { latitude: area.ALat2, longitude: area.ALon1 }
          ];

          // Check if the current user's position is within the area
          const inAreaRange = geolib.isPointInside(currentPosition, areaPolygon);

          areaObject[area.AreaID] = inAreaRange;
        });

        let isUserInAnyArea = false;
        let isUserInAnySector = false;

        // Loop through areaObject true/false checks to see if user is in an area
        _.forEach(areaObject, (boolean, AreaID) => {
          // If user is in an area, dispatch the whole area and set isUserInAnyArea to true
          if (boolean) {
            isUserInAnyArea = true;

            dispatch({
              type: IN_CURRENT_AREA,
              payload: areas[AreaID]
            });

            const isInSectorBooleanArray = [];

            // Loop through sectors to see if user is in it
            _.forEach(areas[AreaID].sectors, sector => {
              console.log('loop of sectors: ', sector.SectorID);

              const sectorPolygon = [
                { latitude: sector.c1, longitude: sector.d1 },
                { latitude: sector.c2, longitude: sector.d2 },
                { latitude: sector.c3, longitude: sector.d3 },
                { latitude: sector.c4, longitude: sector.d4 },
              ];

              const inSectorRange = geolib.isPointInside(currentPosition, sectorPolygon);

              isInSectorBooleanArray.push(inSectorRange)

              // If the user is in it, dispatch and run code
              if (inSectorRange) {
                // console.log('firebase.apps', firebase.app('liveDB'));
                // const liveDBRef = firebase.app('liveDB').database().ref('/');
                //
                // liveDBRef.update({
                //   [sector.SectorID]: true
                // });
                //
                // userRef.update({
                //   lightChecks: {
                //     isInSector: false,
                //     currentSector: sector.SectorID
                //   }
                // });

                dispatch({
                  type: IN_CURRENT_SECTOR,
                  payload: sector
                });
              }

              // Ping light to change
              const currentArea = areas[AreaID];
              const currentSector = sector;

              userRef.once('value', userSnapshot => {
                const currentUser = userSnapshot.val();

                // Check is user is entering sector for first time
                if (currentUser.lightChecks.isInSector == false) {
                  console.log('user entering sector for first time');
                  // Add 1 to number of times user has entered sector
                  const currentNumTimesEnteredSector = currentUser.userStats.numTimesEnteredSector;
                  let currentNumTimesLightChanged = currentUser.userStats.numTimesLightChanged;

                  // Logic for seeing if light changes
                  const percentage = currentArea.changePercentage;
                  const randomNum = Math.random();
                  let changeLight = false;

                  if (randomNum <= percentage) {
                    // Only send a light change to live server if randomized number is true
                    changeLight = true;
                    currentNumTimesLightChanged++;
                    console.log('firebase.apps', firebase.app('liveDB'));
                    const liveDBRef = firebase.app('liveDB').database().ref('/');

                    liveDBRef.update({
                      [sector.SectorID]: true
                    });
                  } else {
                    changeLight = false;
                  }

                  console.log('user in sector: ', sector.SectorID);

                  // Update user stats
                  userRef.update({
                    lightChecks: {
                      isInSector: true,
                      currentSector: sector.SectorID
                    },
                    userStats: {
                      numTimesEnteredSector: (currentNumTimesEnteredSector + 1),
                      numTimesLightChanged: currentNumTimesLightChanged
                    }
                  });

                  // Update app stats
                  console.log('appStatsRef: ', appStatsRef);
                }
              });
            });

            let checkBooleanArray = false;
            _.forEach(isInSectorBooleanArray, newBoolean => {
              if (newBoolean) { checkBooleanArray = true; }
            });

            if (!checkBooleanArray) {
              const lastSectorRef = firebase.database().ref(`/user/${user.uid}/lightChecks/currentSector`)

              lastSectorRef.once('value', lastSectorRefSnapshot => {
                const lastSector = lastSectorRefSnapshot.val();
                console.log('lastSector: ', lastSector);

                const liveDBRef = firebase.app('liveDB').database().ref('/');

                liveDBRef.update({
                  [lastSector]: false
                });

                userRef.update({
                  lightChecks: {
                    isInSector: false,
                    lastSector
                  }
                });


              })

            }
          }
        });

        // If user was in no areas, clear our current area and sector values
        if (!isUserInAnyArea) {
          dispatch({
            type: IN_CURRENT_AREA,
            payload: null
          });

          dispatch({
            type: IN_CURRENT_SECTOR,
            payload: null
          });
        }
      });
    }
  };
};

// export const getZonesAndApproaches = (currentPosition, user) => {
//   console.log('getZonesAndApproaches()');
//
//   return (dispatch) => {
//     if (currentPosition) {
//       if (user) {
//         const zonesRef = firebase.database().ref('/zones')
//
//         zonesRef.once('value', snapshot => {
//           const zones = snapshot.val();
//
//           _.forEach(zones, (zone, zoneId) => {
//             const coords = zone.coords;
//             const zonePolygon = [];
//
//             _.forEach(coords, coord => {
//               zonePolygon.push(coord);
//             });
//
//             const inRange = geolib.isPointInside(currentPosition, zonePolygon);
//
//             if (inRange) {
//               dispatch({
//                 type: IN_CURRENT_ZONE,
//                 payload: zone
//               });
//             }
//           });
//         });
//       }
//     }
//   };
// };

// export const getNearbyLocations = (currentPosition, user) => {
//   return (dispatch) => {
//     if (currentPosition) {
//
//       // If there is a logged in user, loop through zones
//       if (user) {
//         firebase.database().ref('/box-locations')
//           .once('value', snapshot => {
//             const locations = snapshot.val().filter(x => {
//               return (x !== (undefined || null || ''));
//             });
//
//             const nearbyBoxes = [];
//
//             _.forEach(locations, location => {
//               const distance = geolib.getDistance(
//                 {
//                   latitude: currentPosition.latitude,
//                   longitude: currentPosition.longitude
//                 },
//                 {
//                   latitude: location.lat,
//                   longitude: location.long
//                 }
//               )
//
//               nearbyBoxes.push(location);
//
//               if (distance < 350) {
//                 nearbyBoxes.push(location);
//               }
//             });
//
//             for (let i = 0; i < nearbyBoxes.length; i++) {
//               _.forEach(nearbyBoxes[i].zones, (zone, zoneId) => {
//                 const coords = zone.coordGroup;
//                 const coordsLength = _.size(coords);
//
//                 const polygon = [];
//                 let index = 0;
//                 while (index < coordsLength) {
//                   const newPoint = {
//                     latitude: coords[index].lat,
//                     longitude: coords[index].long
//                   };
//                   polygon.push(newPoint);
//                   index++;
//                 }
//
//                 const inRange = geolib.isPointInside(currentPosition, polygon);
//                 const lightChanged = Math.random() > 0.5 ? true : false;
//
//                 const zoneRef = firebase.database().ref(`/box-locations/${nearbyBoxes[i].boxId}/zones/${zoneId}`);
//                 const userStatsRef = firebase.database().ref(`/user/${user.uid}/userStats`);
//
//                 zoneRef.once('value', snapshot => {
//                   const currentZone = snapshot.val();
//
//                   if (inRange) {
//                     // Check if a signal has already been sent. If signal hasn't been sent, carry out this code.
//                     if (currentZone.signalWasSent === false) {
//                       // Check if the light was changed and update user stats
//                       if (lightChanged) {
//                         userStatsRef.update({
//                           numTimesLightChanged: user.data.userStats.numTimesLightChanged + 1,
//                           numTimesEnteredZone: user.data.userStats.numTimesEnteredZone + 1
//                         }).then(() => {
//                           // Update the zone to reflect that the signal
//                           // was sent so the previous code doesn't run again
//                           zoneRef.update({
//                             signalWasSent: true,
//                             inRange,
//                             lightChanged
//                           });
//                         })
//                       } else {
//                         userStatsRef.update({
//                           numTimesEnteredZone: user.data.userStats.numTimesEnteredZone + 1
//                         }).then(() => {
//                           // Update the zone to reflect that the signal
//                           // was sent so the previous code doesn't run again
//                           zoneRef.update({
//                             signalWasSent: true,
//                             inRange,
//                             lightChanged
//                           });
//                         })
//                       }
//                     }
//                   } else {
//                     zoneRef.update({
//                       signalWasSent: false,
//                       inRange: false,
//                       lightChanged: false
//                     })
//                   }
//
//                 })
//                 // if (inRange && num > 0.5) {
//                 //   zoneRef.update({
//                 //     inRange: true,
//                 //     lightChanged: 'Yes'
//                 //   })
//                 // }
//
//               })
//             };
//           });
//       }
//
//       // Loop through zones with no user
//       console.log('no user logged in, loop zones');
//
//       firebase.database().ref('/box-locations')
//         .on('value', snapshot => {
//           const locations = snapshot.val().filter(x => {
//             return (x !== (undefined || null || ''));
//           });
//
//           let nearbyBoxes = [];
//
//           _.map(locations, location => {
//             const distance = geolib.getDistance(
//               {
//                 latitude: currentPosition.latitude,
//                 longitude: currentPosition.longitude
//               },
//               {
//                 latitude: location.lat,
//                 longitude: location.long
//               }
//             )
//
//             // if (distance < 350) {
//             //   nearbyBoxes.push(location);
//             // }
//             nearbyBoxes.push(location);
//
//           });
//
//           dispatch({
//             type: GET_NEARBY_BOXES,
//             payload: nearbyBoxes
//           });
//         });
//     }
//   };
// };

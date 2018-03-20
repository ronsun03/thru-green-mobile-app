import firebase from 'firebase';
import geolib from 'geolib';
import _ from 'lodash';
import axios from 'axios';
import { AsyncStorage } from 'react-native';

import {
  SET_CURRENT_POSITION,
  GET_AREAS,
  IN_CURRENT_AREA,
  IN_CURRENT_SECTOR,
  APP_TOGGLE,
  SET_CURRENT_SPEED
} from './types';

// export const keepAppOnOrOff = (boolean) => {
//   return (dispatch) => {
//     dispatch({
//       type: APP_TOGGLE,
//       payload: boolean
//     })
//   }
// }

export const initializeToggle = boolean => {
  return (dispatch) => {
    dispatch({
      type: APP_TOGGLE,
      payload: boolean
    });
  }
}

export const appToggle = (isOn, user) => {
  return (dispatch) => {
    AsyncStorage.setItem('appToggle', JSON.stringify(isOn)).then(() => {
      console.log(`App toggle set to ${isOn} and stored in async storage.`);
      dispatch({
        type: APP_TOGGLE,
        payload: isOn
      });
    });

    // if app is turned off, turn last sector off
    if (!isOn) {
      const userRef = firebase.database().ref(`/user/${user.uid}`);
      const liveDBRef = firebase.app('liveDB').database().ref('/');

      AsyncStorage.getItem('lastSector').then(response => {
        const lastSector = response;

        liveDBRef.update({
          [lastSector]: false
        });

        AsyncStorage.removeItem('lastSector');
      });

      userRef.update({
        lightChecks: {
          isInSector: false
        }
      });
    }
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

    let mph = speed;

    if (speed < 0) {
      mph = 0;
    }

    const object = {
      uid: user.uid,
      lat: region.latitude,
      lng: region.longitude,
      speed: mph,
      time: date
    };

    AsyncStorage.getItem('tempData').then(response => {
      // console.log('getItem response: ', response);
      if (!response) {
        // Create an array and push this data to it
        const array = [];
        array.push(object);
        AsyncStorage.setItem('tempData', JSON.stringify(array))
      }

      if (response) {
        const array = JSON.parse(response);
        // console.log('temp array: ', array);
        array.push(object);
        AsyncStorage.setItem('tempData', JSON.stringify(array))
      }
    })

    // axios.post('http://ec2-18-219-64-185.us-east-2.compute.amazonaws.com:8080/api/push-to-sql', object)
    //   .then(response => {
    //     console.log('pushDataToDB response: ', response);
    //   })
    //   .catch(error => {
    //     console.log('pushDataToDB error: ', error);
    //   });
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

      const areaRef = firebase.database().ref('/areas');
      const userRef = firebase.database().ref(`/user/${user.uid}`);
      // const appStatsRef = firebase.database().ref(`/appStats/`);
      const liveDBRef = firebase.app('liveDB').database().ref('/');

      // Get latest list of areas
      AsyncStorage.getItem('areaList').then(response => {
        const areas = JSON.parse(response);

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
                dispatch({
                  type: IN_CURRENT_SECTOR,
                  payload: sector
                });

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

                    // Add last sector to AsyncStorage
                    AsyncStorage.setItem('lastSector', sector.SectorID);
                  }

                  // Check is user went straight from one sector to the other
                  if (currentUser.lightChecks.isInSector == true) {
                    const currentSectorID = sector.SectorID;
                    const userLastSector = currentUser.lightChecks.currentSector;

                    if (currentSectorID !== userLastSector) {
                      userRef.update({
                        lightChecks: {
                          isInSector: true,
                          currentSector: currentSectorID
                        }
                      });

                      liveDBRef.update({
                        [userLastSector]: false
                      });

                      AsyncStorage.setItem('lastSector', userLastSector);
                    }
                  }
                });
              }
            });

            let checkBooleanArray = false;
            _.forEach(isInSectorBooleanArray, newBoolean => {
              if (newBoolean) { checkBooleanArray = true; }
            });

            if (!checkBooleanArray) {
              const lastSectorRef = firebase.database().ref(`/user/${user.uid}/lightChecks/currentSector`)

              lastSectorRef.once('value', lastSectorRefSnapshot => {
                const lastSector = lastSectorRefSnapshot.val();

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

                dispatch({
                  type: IN_CURRENT_SECTOR,
                  payload: null
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
      })

      // areaRef.once('value', snapshot => {
      //   const areas = snapshot.val();
      //   const areaObject = {};
      //
      //   // Loop through each area
      //   _.forEach(areas, (area) => {
      //     const areaPolygon = [
      //       { latitude: area.ALat1, longitude: area.ALon1 },
      //       { latitude: area.ALat1, longitude: area.ALon2 },
      //       { latitude: area.ALat2, longitude: area.ALon2 },
      //       { latitude: area.ALat2, longitude: area.ALon1 }
      //     ];
      //
      //     // Check if the current user's position is within the area
      //     const inAreaRange = geolib.isPointInside(currentPosition, areaPolygon);
      //
      //     areaObject[area.AreaID] = inAreaRange;
      //   });
      //
      //   let isUserInAnyArea = false;
      //   let isUserInAnySector = false;
      //
      //   // Loop through areaObject true/false checks to see if user is in an area
      //   _.forEach(areaObject, (boolean, AreaID) => {
      //     // If user is in an area, dispatch the whole area and set isUserInAnyArea to true
      //     if (boolean) {
      //       isUserInAnyArea = true;
      //
      //       dispatch({
      //         type: IN_CURRENT_AREA,
      //         payload: areas[AreaID]
      //       });
      //
      //       const isInSectorBooleanArray = [];
      //
      //       // Loop through sectors to see if user is in it
      //       _.forEach(areas[AreaID].sectors, sector => {
      //         const sectorPolygon = [
      //           { latitude: sector.c1, longitude: sector.d1 },
      //           { latitude: sector.c2, longitude: sector.d2 },
      //           { latitude: sector.c3, longitude: sector.d3 },
      //           { latitude: sector.c4, longitude: sector.d4 },
      //         ];
      //
      //         const inSectorRange = geolib.isPointInside(currentPosition, sectorPolygon);
      //
      //         isInSectorBooleanArray.push(inSectorRange)
      //
      //         // If the user is in it, dispatch and run code
      //         if (inSectorRange) {
      //           dispatch({
      //             type: IN_CURRENT_SECTOR,
      //             payload: sector
      //           });
      //         }
      //
      //         // Ping light to change
      //         const currentArea = areas[AreaID];
      //         const currentSector = sector;
      //
      //         userRef.once('value', userSnapshot => {
      //           const currentUser = userSnapshot.val();
      //
      //           // Check is user is entering sector for first time
      //           if (currentUser.lightChecks.isInSector == false) {
      //             console.log('user entering sector for first time');
      //             // Add 1 to number of times user has entered sector
      //             const currentNumTimesEnteredSector = currentUser.userStats.numTimesEnteredSector;
      //             let currentNumTimesLightChanged = currentUser.userStats.numTimesLightChanged;
      //
      //             // Logic for seeing if light changes
      //             const percentage = currentArea.changePercentage;
      //             const randomNum = Math.random();
      //             let changeLight = false;
      //
      //             if (randomNum <= percentage) {
      //               // Only send a light change to live server if randomized number is true
      //               changeLight = true;
      //               currentNumTimesLightChanged++;
      //               const liveDBRef = firebase.app('liveDB').database().ref('/');
      //
      //               liveDBRef.update({
      //                 [sector.SectorID]: true
      //               });
      //             } else {
      //               changeLight = false;
      //             }
      //
      //             console.log('user in sector: ', sector.SectorID);
      //
      //             // Update user stats
      //             userRef.update({
      //               lightChecks: {
      //                 isInSector: true,
      //                 currentSector: sector.SectorID
      //               },
      //               userStats: {
      //                 numTimesEnteredSector: (currentNumTimesEnteredSector + 1),
      //                 numTimesLightChanged: currentNumTimesLightChanged
      //               }
      //             });
      //
      //             // Update app stats
      //             console.log('appStatsRef: ', appStatsRef);
      //           }
      //         });
      //       });
      //
      //       let checkBooleanArray = false;
      //       _.forEach(isInSectorBooleanArray, newBoolean => {
      //         if (newBoolean) { checkBooleanArray = true; }
      //       });
      //
      //       if (!checkBooleanArray) {
      //         const lastSectorRef = firebase.database().ref(`/user/${user.uid}/lightChecks/currentSector`)
      //
      //         lastSectorRef.once('value', lastSectorRefSnapshot => {
      //           const lastSector = lastSectorRefSnapshot.val();
      //           console.log('lastSector: ', lastSector);
      //
      //           const liveDBRef = firebase.app('liveDB').database().ref('/');
      //
      //           liveDBRef.update({
      //             [lastSector]: false
      //           });
      //
      //           userRef.update({
      //             lightChecks: {
      //               isInSector: false,
      //               lastSector
      //             }
      //           });
      //
      //
      //         })
      //
      //       }
      //     }
      //   });
      //
      //   // If user was in no areas, clear our current area and sector values
      //   if (!isUserInAnyArea) {
      //     dispatch({
      //       type: IN_CURRENT_AREA,
      //       payload: null
      //     });
      //
      //     dispatch({
      //       type: IN_CURRENT_SECTOR,
      //       payload: null
      //     });
      //   }
      // });
    }
  };
};

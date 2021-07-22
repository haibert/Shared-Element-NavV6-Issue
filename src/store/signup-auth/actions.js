import AsyncStorage from '@react-native-async-storage/async-storage'
export const ADD_EMAIL = 'ADD_EMAIL'
export const ADD_PHONE = 'ADD_PHONE'
export const ADD_FIRSTNAME = 'ADD_ADD_FIRSTNAME'
export const ADD_LASTNAME = 'ADD_LASTNAME'
export const ADD_PASSWORD = 'ADD_ADD_PASSWORD'
export const ADD_BIRTHDAY = 'ADD_BIRTHDAY'
export const ADD_USERNAME = 'ADD_USERNAME'
export const SIGN_UP = 'SIGN_UP'
export const LOGIN = 'LOGIN'
export const SET_USER_ID = 'SET_USER_ID'
export const EMAIL_CODE = 'EMAIL_CODE'
export const TEXT_CODE = 'TEXT_CODE'
export const CHANGE_AVATAR = 'CHANGE_AVATAR'
export const SEARCH = 'SEARCH'
export const LOAD_PROFILE = 'LOAD_PROFILE '
export const FOLLOW = 'FOLLOW'
export const UNFOLLOW = 'UNFOLLOW'
export const EMPTY_PROFILE = 'EMPTY_PROFILE'
export const LOAD_FOLLOWINGS = 'LOAD_FOLLOWINGS'
export const EDIT_PROFILE = 'EDIT_PROFILE'

//models
import { Search } from '../../models/SearchModel'
import { Gallery } from '../../models/GalleryModel'
import { Follows } from '../../models/FollowsModel'

//Gallery Actions
import { setGalleries } from '../event/action'

import { LINK } from '../../utilities/apiLink'

export const addEmail = (email) => {
    return {
        type: ADD_EMAIL,
        emailAdded: email,
    }
}

export const addPhone = (phone) => {
    return {
        type: ADD_PHONE,
        phoneAdded: phone,
    }
}

export const addFirstName = (name) => {
    return {
        type: ADD_FIRSTNAME,
        nameAdded: name,
    }
}

export const addLastName = (lastName) => {
    return {
        type: ADD_LASTNAME,
        lastNameAdded: lastName,
    }
}

export const addPassword = (password) => {
    return {
        type: ADD_PASSWORD,
        passwordAdded: password,
    }
}

export const addBirthday = (birthday) => {
    return {
        type: ADD_BIRTHDAY,
        birthdayAdded: birthday,
    }
}

export const addUsername = (username) => {
    return {
        type: ADD_USERNAME,
        usernameAdded: username,
    }
}

export const signupUser = () => {
    return async (dispatch, getState) => {
        const userName = getState().signupReducer.signupInfo.username
        const password = getState().signupReducer.signupInfo.password
        const phone =
            getState().signupReducer.signupInfo.phoneNumber.length > 2
                ? getState().signupReducer.signupInfo.phoneNumber
                : ''
        const email =
            getState().signupReducer.signupInfo.email.length > 2
                ? getState().signupReducer.signupInfo.email
                : ''
        const firstName = getState().signupReducer.signupInfo.firstName
        const lastName = getState().signupReducer.signupInfo.lastName

        const body = JSON.stringify({
            userName,
            password,
            phone,
            email,
            firstName,
            lastName,
        })
        console.log('🚀 ~ file: actions.js ~ line 82 ~ return ~ body', body)
        try {
            const response = await fetch(`${LINK}&registeration=1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
            })
            const responseData = await response.json()
            console.log(
                '🚀 ~ file: actions.js ~ line 103 ~ return ~ responseData',
                responseData
            )

            const cantRegister =
                responseData.message?.user?.registeration?.error

            if (cantRegister) {
                throw new Error('Something went wrong!')
            }

            const newUserID = responseData.message?.userData?.uniqID
            console.log(
                '🚀 ~ file: actions.js ~ line 116 ~ return ~ newUserID',
                newUserID
            )
            await storeData(newUserID)

            dispatch({
                type: SIGN_UP,
                newUserID: newUserID,
            })
        } catch {
            throw error
        }
    }
}

export const login = (username, password) => {
    return async (dispatch, getState) => {
        let userID
        const body = JSON.stringify({
            userName: username,
            password,
        })
        try {
            const response = await fetch(`${LINK}&auth=1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
            })

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()

                const userID = data.message?.userData?.basic?.uniqueID
                const userInfo = data.message?.userData
                console.log(
                    '🚀 ~ file: actions.js ~ line 171 ~ return ~ userInfo',
                    userInfo
                )
                const credentials = data.message?.userData?.body

                dispatch({
                    type: LOGIN,
                    userID: userID,
                    fullInfo: userInfo,
                })

                dispatch(setGalleries(userID))

                await storeCredentials(
                    credentials.userName,
                    credentials.password,
                    userID
                )

                const error = data?.message?.user?.authCheck
                if (error === 'ERROR') {
                    throw new Error('Incorrect Credentials')
                }
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

export const setUserID = (userID) => {
    return {
        type: SET_USER_ID,
        userID: userID,
    }
}

export const sendEmailCode = (email) => {
    return async (dispatch, getState) => {
        const body = JSON.stringify({
            email,
        })
        try {
            const response = await fetch(`${LINK}&validationEmail=1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
            })

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()

                code = data?.message?.code

                const errorCode = data.message?.error
                if (errorCode) {
                    throw new Error('The entered email address is not valid.')
                }
            } catch (error) {
                throw error
            }

            dispatch({
                type: EMAIL_CODE,
                emailCode: code,
            })
        } catch (error) {
            throw error
        }
    }
}

export const sendTextCode = (phone) => {
    return async (dispatch, getState) => {
        const body = JSON.stringify({
            phone,
        })
        try {
            const response = await fetch(`${LINK}&validationSMS=1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
            })

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()

                code = data.message.code

                const errorCode = data.message.error
                if (errorCode) {
                    throw new Error('The entered phone number is not valid.')
                }
            } catch (error) {
                throw new Error('Something went wrong!')
            }

            dispatch({
                type: TEXT_CODE,
                textCode: code,
            })
        } catch (error) {
            throw error
        }
    }
}

export const checkUserExistence = (userName) => {
    return async (dispatch, getState) => {
        const body = JSON.stringify({
            userName,
        })
        try {
            const response = await fetch(`${LINK}&check-userName=1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
            })

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()

                const userExists = data.message?.userNameCheck?.error
                if (userExists) {
                    throw new Error('This username is unavailable.')
                }
            } catch (error) {
                throw error
            }

            dispatch({
                type: TEXT_CODE,
                textCode: code,
            })
        } catch (error) {
            throw error
        }
    }
}

export const checkEmailExistence = (email) => {
    return async (dispatch, getState) => {
        const body = JSON.stringify({
            email,
        })
        try {
            const response = await fetch(`${LINK}&check-email=1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
            })

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()
                console.log(
                    '🚀 ~ file: actions.js ~ line 245 ~ return ~ data',
                    data
                )
                const emailExists = data.message?.emailCheck?.error
                if (emailExists) {
                    throw new Error('This email is unavailable.')
                }
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

export const changeAvatar = (avatar) => {
    return async (dispatch, getState) => {
        const userID = getState().signupReducer.userInfo.userID

        const body = JSON.stringify({
            userID,
            avatar,
        })
        console.log('🚀 ~ file: actions.js ~ line 407 ~ return ~ body', body)
        try {
            const response = await fetch(`${LINK}&change-avatar=1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
            })

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()
                console.log(
                    '🚀 ~ file: actions.js ~ line 408 ~ return ~ data',
                    data
                )

                if (data.message?.response === 'success') {
                    const avatarThumbPath = data.message.avatarThumb
                    const avatarFullPath = data.message.avatar

                    dispatch({
                        type: CHANGE_AVATAR,
                        avatarThumbPath,
                        avatarFullPath,
                    })
                    return
                } else {
                    throw new Error('Something went wrong!')
                }
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

export const search = (text) => {
    return async (dispatch, getState) => {
        // const userID = getState().signupReducer.userInfo.userID

        const body = JSON.stringify({
            userName: text,
        })
        try {
            const response = await fetch(`${LINK}&search-profile=1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
            })

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()
                const searches = data.message.data

                const loadedSearches = []
                for (const key in searches) {
                    loadedSearches.push(
                        new Search(
                            searches[key].uniqueID,
                            searches[key].userName,
                            searches[key].firstName,
                            searches[key].lastName,
                            searches[key].avatar
                        )
                    )
                }

                dispatch({
                    type: SEARCH,
                    searches: loadedSearches,
                })
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

export const loadProfile = (userID) => {
    return async (dispatch, getState) => {
        // const userID = getState().signupReducer.userInfo.userID

        const body = JSON.stringify({
            userID,
        })
        // console.log('🚀 ~ file: actions.js ~ line 496 ~ return ~ body', body)
        try {
            const response = await fetch(`${LINK}&get-user=1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
            })

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()
                const loadedProfile = data.message.data
                // console.log(
                //     '🚀 ~ file: actions.js ~ line 509 ~ return ~ loadedProfile',
                //     loadedProfile
                // )

                dispatch({
                    type: LOAD_PROFILE,
                    loadedProfile: loadedProfile,
                })
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

export const emptyProfile = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: EMPTY_PROFILE,
                loadedProfile: null,
            })
        } catch (error) {
            throw error
        }
    }
}

export const followUnfollow = (followID, followType) => {
    return async (dispatch, getState) => {
        const userID = getState().signupReducer.userInfo.userID

        let link = `${LINK}&follow-user=1`

        if (followType === 'unFollow') {
            link = `${LINK}&unfollow-user=1`
        }

        const body = JSON.stringify({
            userID: followID,
            followerID: userID,
        })
        console.log('🚀 ~ file: actions.js ~ line 561 ~ return ~ body', body)

        try {
            const response = await fetch(link, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
            })

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()

                const results = data.message.response

                if (results === 'success') {
                    dispatch({
                        type: UNFOLLOW,
                    })
                }
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

export const loadFollowersFollowing = (userID, followType) => {
    return async (dispatch, getState) => {
        let link = `${LINK}&get-user-followings=1`

        if (followType === 'followers') {
            link = `${LINK}&get-user-followers=1`
        }

        const body = JSON.stringify({
            userID: userID,
        })

        try {
            const response = await fetch(link, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
            })

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()
                const follows = data.message?.data

                const loadedFollows = []
                for (const key in follows) {
                    loadedFollows.push(
                        new Follows(
                            follows[key].avatarFullPath,
                            follows[key].avatarThumbPath,
                            follows[key].firstName,
                            follows[key].lastName,
                            follows[key].userID,
                            follows[key].userName
                        )
                    )
                }

                dispatch({
                    type: LOAD_FOLLOWINGS,
                    followings: loadedFollows,
                })
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

export const editProfile = (firstName, lastName, birthDate, phone) => {
    return async (dispatch, getState) => {
        const userID = getState().signupReducer.userInfo.userID
        const firstNamePassed =
            firstName === null
                ? getState().signupReducer.userInfo.firstName
                : firstName
        const lastNamePassed =
            lastName === null
                ? getState().signupReducer.userInfo.lastName
                : lastName
        // const birthDatePassed =
        //     birthDate === null
        //         ? getState().signupReducer.userInfo.birthDate
        //         : birthDate
        const birthDatePassed = birthDate === null ? '12/12/12' : birthDate
        const phonePassed =
            phone === null ? getState().signupReducer.userInfo.phone : phone

        const link = `${LINK}&edit-profile=1`

        const body = JSON.stringify({
            userID: userID,
            firstName: firstNamePassed,
            lastName: lastNamePassed,
            birthDate: birthDatePassed,
            phone: phonePassed,
        })
        console.log('🚀 ~ file: actions.js ~ line 685 ~ return ~ body', body)

        try {
            const response = await fetch(link, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
            })

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()
                console.log(
                    '🚀 ~ file: actions.js ~ line 704 ~ return ~ data',
                    data
                )
                const userProfileData = data.message?.userProfileData
                const errorMessage = data.message?.response === 'error'

                if (!userProfileData || errorMessage) {
                    throw new Error('Something went wrong!')
                }

                dispatch({
                    type: EDIT_PROFILE,
                    userProfileData: userProfileData,
                })
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

// helpers
const storeData = async (value) => {
    try {
        await AsyncStorage.removeItem('userID')
        await AsyncStorage.setItem('userID', value)
    } catch (e) {
        console.log(e)
        // throw error
    }
}

const storeCredentials = async (username, password, userID) => {
    try {
        await AsyncStorage.setItem('username', username)
        await AsyncStorage.setItem('password', password)
        await AsyncStorage.setItem('userID', userID)
    } catch (error) {
        console.log(error)
        throw error
    }
}

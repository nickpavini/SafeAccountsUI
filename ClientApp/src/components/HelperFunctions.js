/*
 * This area is for code that is re-used in multiple places,
 * as well as a place to put functions in an effort to reduce
 * the number of props passed to each component.
 */ 

var CryptoJS = require("crypto-js");

// attempt to retrieve a new access token with the existing cookies.. Note that cookies are http only and contain JWT tokens and refresh tokens
export async function AttempRefresh() {
    if (window.localStorage.getItem("AccessToken") === null || window.localStorage.getItem("RefreshToken") === null)
        return null;

    // http request options
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'ApiKey': process.env.REACT_APP_API_KEY,
            'AccessToken': window.localStorage.getItem("AccessToken"),
            'RefreshToken': window.localStorage.getItem("RefreshToken")
        }
    };

    // make a call to the refresh and if the result is ok, then we are logged in
    const reqURI = process.env.REACT_APP_WEBSITE_URL + '/refresh';
    const response = await fetch(reqURI, requestOptions);
    if (response.ok) {
        const responseText = await response.text();
        var loginRes = JSON.parse(responseText);

        window.localStorage.setItem("AccessToken", loginRes.accessToken);
        window.localStorage.setItem("RefreshToken", loginRes.refreshToken.token);

        return loginRes.id;
    }
    else {
        window.localStorage.removeItem("UserKey"); // if cookies are no longer valid, lets delete the key
        return null;
    }
}

// call back function for app to set user logged out... NOTE: here we will make a call to the server which removes the cookies in the returning response
export async function UpdateUserLoggedOut(SetAppState) {
    window.localStorage.removeItem("UserKey"); // delete user key upon signout
    window.localStorage.removeItem("AccessToken"); // delete token upon signout
    window.localStorage.removeItem("RefreshToken"); // delete token upon signout

    // reset state after removing cookies.. this will cause re-render and should make app be not logged in
    SetAppState({
        loggedIn: false, loading: false, // user is now logged out.. login page will render
        uid: null, account_info: null, safe: null, folders: null,
        searchString: null, selectedFolderID: null
    });
}

// aes encrypt string to hex string
export function Encrypt(str) {
    var KEY = window.localStorage.getItem("UserKey").substring(0, 32); //32 bit
    var IV = "1234567890000000";//16 bits
    var keyAsBytes = CryptoJS.enc.Utf8.parse(KEY);
    var iv = CryptoJS.enc.Utf8.parse(IV);

    var srcs = CryptoJS.enc.Utf8.parse(str); // incoming string is not hex string
    var encrypted = CryptoJS.AES.encrypt(srcs, keyAsBytes, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.ciphertext.toString();
}

// aes decrypt hex string
export function Decrypt(str) {
    var KEY = window.localStorage.getItem("UserKey").substring(0, 32); //32 bit
    var IV = "1234567890000000";//16 bits
    var keyAsBytes = CryptoJS.enc.Utf8.parse(KEY);
    var iv = CryptoJS.enc.Utf8.parse(IV);
    var encryptedHexStr = CryptoJS.enc.Hex.parse(str);
    var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    var decrypt = CryptoJS.AES.decrypt(srcs, keyAsBytes, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}

// aes encrypt entire safe
export function EncryptSafe(safe) {
    var encryptedSafe = [];

    // go through and decrypt safe
    safe.map((value, index) => {
        var valueCopy = Clone(value);
        encryptedSafe.push(valueCopy);
        encryptedSafe[index].title = Encrypt(valueCopy.title);
        encryptedSafe[index].login = Encrypt(valueCopy.login);
        encryptedSafe[index].password = Encrypt(valueCopy.password);
        encryptedSafe[index].url = Encrypt(valueCopy.url);
        encryptedSafe[index].description = Encrypt(valueCopy.description);
        return null;
    });

    return encryptedSafe;
}

export function DecryptSafe(safe) {
    var decryptedSafe = [];

    // go through and decrypt safe
    safe.map((value, index) => {
        decryptedSafe.push(value);
        decryptedSafe[index].title = Decrypt(value.title);
        decryptedSafe[index].login = Decrypt(value.login);
        decryptedSafe[index].password = Decrypt(value.password);
        decryptedSafe[index].url = Decrypt(value.url);
        decryptedSafe[index].description = Decrypt(value.description);
        return null;
    });

    return decryptedSafe;
}

// aes encrypt all folders
export function EncryptFolders(folders) {
    var encryptedFolders = [];

    // go through and decrypt safe
    folders.map((value, index) => {
        var valueCopy = Clone(value);
        encryptedFolders.push(valueCopy);
        encryptedFolders[index].folderName = Encrypt(valueCopy.folderName);
        return null;
    });

    return encryptedFolders;
}

export function DecryptFolders(folders) {
    var decryptedFolders = [];

    // go through and decrypt safe
    folders.map((value, index) => {
        decryptedFolders.push(value);
        decryptedFolders[index].folderName = Decrypt(value.folderName);
        return null;
    });

    return decryptedFolders;
}

// call back for the sidebar to set search params for the safe.. If a folder, or favorites category is selected, search string will search within the additional specs
export function SetSearchString(str, SetAppState) {
    SetAppState({ searchString: str, showFavorites: false, selectedItems: new Set() });
}

// call back for the Folder component to set selected for the safe.. if a new folder was chosen, then we update showFavorites to false. This also happens when All entries is selected
export function SetSelectedFolder(id, SetAppState) {
    SetAppState({ selectedFolderID: id, showFavorites: false, selectedItems: new Set() });
}

// sets the showFavorites attribute to true, and resets the searchstring and folder
export function ShowFavorites(SetAppState) {
    document.getElementById("input_text_safe_search").value = "";
    SetAppState({ showFavorites: true, searchString: "", selectedFolderID: null, selectedItems: new Set() });
}

export async function UpdateSelectedItems(id, AppState, SetAppState) {
    var items = AppState.selectedItems;

    // if the id exists, than we are unselecting it, else we are adding it to the selection
    if (AppState.selectedItems.has(id))
        items.delete(id);
    else
        items.add(id);

    // update state
    SetAppState({ selectedItems: items });
}

// POST a new item to the safe
export async function PostSafeItem(encryptedItemToAdd, AppState) {

    // HTTP request options
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'ApiKey': process.env.REACT_APP_API_KEY,
            'AccessToken': window.localStorage.getItem("AccessToken")
        },
        body: JSON.stringify({ title: encryptedItemToAdd.title, login: encryptedItemToAdd.login, password: encryptedItemToAdd.password, url: encryptedItemToAdd.url, description: encryptedItemToAdd.description, folderID: encryptedItemToAdd.folderID })
    };

    //make request and get response
    const response = await fetch(process.env.REACT_APP_WEBSITE_URL + '/users/' + AppState.uid + '/accounts', requestOptions);
    if (response.ok) {
        // get new account with id, then set data to decrypted values internally
        var acc = JSON.parse(await response.text());
        return acc;
    }
    // unauthorized could need new access token, so we attempt refresh
    else if (response.status === 401 || response.status === 403) {
        var uid = await AttempRefresh(); // try to refresh

        // dont recall if the refresh didnt succeed
        if (uid !== null)
            PostSafeItem(encryptedItemToAdd, AppState); // call again
    }
    // if not ok or unauthorized, then its some form of error. code 500, 400, etc...
    else {

    }

    return -1; // upon failure
}

// DELETE multiple items from the safe
export async function DeleteMultipleItems(AppState, SetAppState) {
    // HTTP request options
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'ApiKey': process.env.REACT_APP_API_KEY,
            'AccessToken': window.localStorage.getItem("AccessToken")
        },
        body: JSON.stringify(Array.from(AppState.selectedItems))
    };

    //make request and get response
    const response = await fetch(process.env.REACT_APP_WEBSITE_URL + '/users/' + AppState.uid + '/accounts', requestOptions);
    if (response.ok) {
        var updatedSafe = AppState.safe;
        AppState.selectedItems.forEach(e => {
            // if one fails to be removed, then we throw error... later we may want it to do fetchsafe as backup
            if (!RemoveSafeItemLocally(e, updatedSafe))
                throw new Error({ code: 500, message: "Error: Could not remove item from safe locally" });
        });
        SetAppState({ safe: updatedSafe, selectedItems: new Set() });
    }
    // unauthorized could need new access token, so we attempt refresh
    else if (response.status === 401 || response.status === 403) {
        var uid = await AttempRefresh(); // try to refresh

        // dont recall if the refresh didnt succeed
        if (uid !== null)
            DeleteMultipleItems(AppState, SetAppState); // call again
    }
    // if not ok or unauthorized, then its some form of error. code 500, 400, etc...
    else {

    }
}

// add or edit an item in the safe
export function UpdateSafeItem(safeitem, safe, SetAppState) {
    var updatedSafe = safe; // copy current safe
    var itemIndex = safe.findIndex(e => e.id === safeitem.id); // get index of safeitem passed in

    // if the safe item already exists, this is a modification
    if (itemIndex !== -1) {
        updatedSafe[itemIndex] = safeitem; // modify safeitem
    }
    // if the safe item does not exist, we are adding it to the safe
    else {
        updatedSafe.push(safeitem);
    }

    SetAppState({ safe: updatedSafe }); // update state for re-render
}

export function RemoveSafeItemLocally(item_id, safe) {
    var indexToDelete = safe.findIndex(f => f.id === item_id);
    var deleted = false;

    // if the item exists in safe, we delete it and set the rtn to true
    if (indexToDelete > -1) {
        safe.splice(indexToDelete, 1);
        deleted = true;
    }

    return deleted;
}

// api call to assign a sife item to a specific folder
export async function SetItemFolder(safeitem, folder_id, AppState, SetAppState) {
    // HTTP request options
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'ApiKey': process.env.REACT_APP_API_KEY,
            'AccessToken': window.localStorage.getItem("AccessToken")
        },
        body: folder_id
    };

    //make request and get response
    const response = await fetch(process.env.REACT_APP_WEBSITE_URL + '/users/' + AppState.uid + '/accounts/' + safeitem.id + '/folder', requestOptions);
    if (response.ok) {
        safeitem.folderID = folder_id === 0 ? null : folder_id;
        UpdateSafeItem(safeitem, AppState.safe, SetAppState); // later we may want to do this before the call, and just re-update if the call fails.. it will speed up responsiveness
    }
    // unauthorized could need new access token, so we attempt refresh
    else if (response.status === 401 || response.status === 403) {
        var uid = await AttempRefresh(); // try to refresh

        // dont recall if the refresh didnt succeed
        if (uid !== null)
            SetItemFolder(safeitem, folder_id, AppState, SetAppState); // call again
    }
    // if not ok or unauthorized, then its some form of error. code 500, 400, etc...
    else {
    }
}

// adds a new folder to the props, and updates the db remotely
export async function AddFolder(AppState, SetAppState, firstTry = true, folderToAdd = { folderName: "New Folder", parentID: null }) {
    // append to the props only if this isnt a retry after a potentially fixable error
    if (firstTry)
        UpdateSingleFolder({ id: -1, folderName: folderToAdd.folderName, parentID: folderToAdd.parentID }, AppState.folders, SetAppState)

    // HTTP request options
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'ApiKey': process.env.REACT_APP_API_KEY,
            'AccessToken': window.localStorage.getItem("AccessToken")
        },
        body: JSON.stringify({ folder_name: Encrypt(folderToAdd.folderName), parent_id: folderToAdd.parentID })
    };

    //make request and get response
    const response = await fetch(process.env.REACT_APP_WEBSITE_URL + '/users/' + AppState.uid + '/folders', requestOptions);
    if (response.ok) {
        AppState.folders.pop(); // pop off unneeded with id: -1

        // get new account with id, then set data to decrypted values internally
        var folder = JSON.parse(await response.text());
        folder.folderName = folderToAdd.folderName;
        UpdateSingleFolder(folder, AppState.folders, SetAppState) // legit update folders, first one was just visual with placeholder id
        return folder.id;
    }
    // unauthorized could need new access token, so we attempt refresh
    else if (response.status === 401 || response.status === 403) {
        var uid = await AttempRefresh(); // try to refresh

        // dont recall if the refresh didnt succeed
        if (uid !== null)
            AddFolder(AppState, SetAppState, false); // call again
    }

    // if not ok or unauthorized, then its some form of error. code 500, 400, etc... Also gets here if refresh fails
    // if it didnt work then lets make sure to remove the visual new folder
    AppState.folders.pop();
    SetAppState({ folders: AppState.folders });
    return -1;
}

// DELETE the folder
export async function DeleteFolder(AppState, SetAppState, folder) {
    // HTTP request options
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'ApiKey': process.env.REACT_APP_API_KEY,
            'AccessToken': window.localStorage.getItem("AccessToken")
        }
    };

    //make request and get response
    const response = await fetch(process.env.REACT_APP_WEBSITE_URL + '/users/' + AppState.uid + '/folders/' + folder.id.toString(), requestOptions);
    if (response.ok) {
        const responseText = await response.text();
        var safeAndFolders = JSON.parse(responseText);
        SetAppState({ safe: DecryptSafe(safeAndFolders.safe) }) // update safe
        SetAppState({ folders: DecryptFolders(safeAndFolders.updatedFolders) }); // update the folders
    }
    // unauthorized could need new access token, so we attempt refresh
    else if (response.status === 401 || response.status === 403) {
        var uid = await AttempRefresh(); // try to refresh

        // dont recall if the refresh didnt succeed
        if (uid !== null)
            DeleteFolder(AppState, SetAppState, folder); // call again
    }
    // if not ok or unauthorized, then its some form of error. code 500, 400, etc...
    else {

    }
}

// add or edit a folder
export function UpdateSingleFolder(folder, folders, SetAppState) {
    var updatedFolders = folders; // copy current folders
    var itemIndex = folders.findIndex(e => e.id === folder.id); // get index of folder passed in

    // if the folder already exists, this is a modification
    if (itemIndex !== -1) {
        updatedFolders[itemIndex] = folder; // modify
    }
    // if the folder does not exist, we are adding it
    else {
        updatedFolders.push(folder);

        // update parent to has child if need be for rendering
        if (folder.parentID !== null) {
            var parentIndex = updatedFolders.findIndex(e => e.id === folder.parentID); // get index of folder passed in
            updatedFolders[parentIndex].hasChild = true;
        }

    }

    SetAppState({ folders: updatedFolders }); // update state for re-render
}

// sets the passed in folder to be a child of this folder (regarding the current component)
export async function SetFolderParent(folder, folder_id, AppState, SetAppState) {
    // HTTP request options
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'ApiKey': process.env.REACT_APP_API_KEY,
            'AccessToken': window.localStorage.getItem("AccessToken")
        },
        body: folder_id
    };

    //make request and get response
    const response = await fetch(process.env.REACT_APP_WEBSITE_URL + '/users/' + AppState.uid + '/folders/' + folder.id + '/parent', requestOptions);
    if (response.ok) {
        const responseText = await response.text();
        var folders = JSON.parse(responseText);
        SetAppState({ folders: DecryptFolders(folders) }); // update the folders
    }
    // unauthorized could need new access token, so we attempt refresh
    else if (response.status === 401 || response.status === 403) {
        var uid = await AttempRefresh(); // try to refresh

        // dont recall if the refresh didnt succeed
        if (uid !== null)
            SetFolderParent(folder, folder_id, AppState, SetAppState); // call again
    }
    // if not ok or unauthorized, then its some form of error. code 500, 400, etc...
    else {
    }
}

// open selected items menu and close all others
export async function OpenSelectedItemsMenu(SetAppState) {
    SetAppState({ openSelectedItemsMenu: true, openSafeItemContextMenu: false, openFolderContextMenu: false, openNavbarAccountMenu: false })
}

// close the selected items menu
export async function CloseSelectedItemsMenu(SetAppState) {
    SetAppState({ openSelectedItemsMenu: false });
}

// open safeitem context menu and close all others
export async function OpenSafeItemContextMenu(item_id, left, top, SetAppState) {
    SetAppState({
        openSafeItemContextMenu: true, openSelectedItemsMenu: false, openFolderContextMenu: false, openNavbarAccountMenu: false,
        menu_top: top, menu_left: left, menu_item_id: item_id
    })
}

// close the safeitem context menu
export async function CloseSafeItemContextMenu(SetAppState) {
    SetAppState({ openSafeItemContextMenu: false });
}

// open folder context menu
export async function OpenFolderContextMenu(folder_id, left, top, SetAppState) {
    SetAppState({
        openFolderContextMenu: true, openSafeItemContextMenu: false, openSelectedItemsMenu: false, openNavbarAccountMenu: false,
        menu_top: top, menu_left: left, menu_folder_id: folder_id
    })
}

// close folder context menu
export async function CloseFolderContextMenu(SetAppState) {
    SetAppState({ openFolderContextMenu: false });
}

// open navbar account menu and close all others
export async function OpenNavbarAccountMenu(SetAppState) {
    SetAppState({ openNavbarAccountMenu: true, openFolderContextMenu: false, openSafeItemContextMenu: false, openSelectedItemsMenu: false })
}

// close navbar account menu
export async function CloseNavbarAccountMenu(SetAppState) {
    SetAppState({ openNavbarAccountMenu: false });
}

// open import export menu and close all others
export async function OpenImportExportMenu(SetAppState) {
    SetAppState({ openSelectedItemsMenu: false, openSafeItemContextMenu: false, openFolderContextMenu: false, openNavbarAccountMenu: false })
    document.getElementById("import_export_menu").style.opacity = "1";
}

// close import export menu
export async function CloseImportExportMenu() {
    document.getElementById("import_export_menu").style.opacity = "0";
}

export function toUTF8Array(str) {
    var utf8 = [];
    for (var i = 0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6),
                0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12),
                0x80 | ((charcode >> 6) & 0x3f),
                0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff) << 10)
                | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >> 18),
                0x80 | ((charcode >> 12) & 0x3f),
                0x80 | ((charcode >> 6) & 0x3f),
                0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
}

// clone function from stack overflow.. link: https://stackoverflow.com/questions/728360/how-do-i-correctly-clone-a-javascript-object
function Clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = Clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = Clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}
# Authentication User Stories

## Tasks

### All Users
- [x] Logging In
- [ ] Logging Out
- [x] Viewing My Profile
- [x] Editing My Profile
- [x] Changing My Password
- [ ] Resetting a Forgotten Password

### Administrators
- [ ] View all users
- [ ] Add user
- [ ] Enable/Disable user
- [ ] Change User Password

## Task: Logging In

A user login is required in order to modify data. It is not generally required in order to view data unless that data is somehow restricted to a specific user or role.

### Pages
- Login
- Current Application Page
- Home / Search

### User Steps

1. User is on a page of the application and presses the “Log In” link in the navigation menu
1. Login Page is displayed with a blank email and password (unless auto-filled by either the browser or a plugin such as LastPass)
1. User enters email address and password and presses the “Log In” button to log in ~OR~ presses the “Cancel” button at any point to cancel

### Result

#### Success

The user is redirected to the page that they were on before going to the login page.

In cases where the user went directly to the login page they shall be redirected to the home / search page.

The login menu item shall be replaced with the logout menu item. The name of the currently logged in user shall be displayed in the navigation bar.

#### Failure

The user shall stay on the login page with an appropriate message displayed. The password field shall be cleared. The error message shall be displayed until the user begins to change the email address or starts to type the password.

#### Cancel

The user is redirected to the page they were on before going to the login page.

In cases where the user went directly to the login page they shall be redirected to the home / search page.

## Task: Logging Out

### Pages

- Current Page
- Home / Search

### User Steps

1. Logged in user clicks on their name in the navigation bar
1. A menu drops down having two options: My Profile, and Logout
1. User Selects Logout
1. User is asked if they would like to log out via a dialog box (not currently done, not sure required, will take some testing with the application as-is to determine)
1. User presses yes or no

### Results

#### Yes

The ask dialog is dismissed. If the current page is accessible by anyone, refresh the page. If the current page is only viewable by users in a certain role, the user is redirected to the home / search page.

#### No

The user stays on the screen that that are on. The ask dialog is dismissed.

## Task: Viewing My Profile

### Pages

- User Profile Page

### User Steps

1. Logged in user clicks on their name in the navigation bar
1. A menu drops down having two options: My Profile, and Logout
1. User Selects My Profile

### Result

The profile page for the currently logged in user is displayed. This page displays the information about the currently logged in user in a form that can be editted, though actual editing is described in a different story.

## Task: Editing My Profile

### Pages

- User Profile Page

### User Steps

1. Logged in user clicks on their name in the navigation bar
1. A menu drops down having two options: My Profile, and Logout
1. User Selects My Profile
1. User makes changes from within the User Profile Page
1. User performs one of the following actions
   1. Presses Save Button
   1. Presses Reset Button
   1. Navigates to Another Page

### Result

#### Save Button

The current changes are POSTed to the server. Regardless of the outcome of the POST, the user remains on the profile page.

##### Success

If the POST succeeds a temporary indication such as a toast is displayed indicating success.

##### Failure

If the POST fails an error message is displayed indicating exactly how or why the save failed. The user shall be allowed to retry the save.

#### Rest Button

Any modified fields in the profile are reset to their original values as they existed either upon entering the screen or as of the last successful save of data.

The reset button shall only be enabled when there are unsaved modications on the page.

#### Navigation

If there are no unsaved modifications on the page, navigation shall proceed as normal.

If there are unsaved modifications on the page, the user shall be asked if they would like to save the changes before proceeding. If the user answers "no", navigation proceeds as normal. If the user answers "yes", then changes shall be POSTed with navigation proceeding upon success or cancelled and an error message displayed on the page upon failure.

## Task: Changing My Password

### Pages

- User Profile Page
- Change Password Page

### User Steps

1. User clicks their name in the navigation bar to go to the user profile page
1. A menu drops down having two options: My Profile, and Logout
1. User Selects My Profile
1. User clicks the "Change Password" button
1. User enters current password, new password, and confirmation of new password
1. User clicks "Change Password" button to perform the change or "Cancel" to leave without changing the password

**Note:** The "Change Password" button is eabled only if all three fields are filled in and the New Password and Verify Password fields fit the following criteria:

- at least 8 characters long
- they match

### Result

#### Change Password

##### Success

The user is redirected to the user profile screen and a trasitory message such as a toast is displayed indicating success.

##### Failure

The update of a password can fail for several reasons with the most common being an incorrectly typed current password. The user shall be presented with an error message that indicates the reason for the failure. They may then choose to retry the operation (with or without changes being made) or cancel. The error message shall remain visible until the user either resubmitts or cancels the change.

#### Cancel

Upon cancel, the user shall be redirected to the user profile screen.

## Task: Resetting a Forgotten Password

### Pages

- Login Page
- Send Reset Message Page
- Reset Password Page

### Steps

1. User attempts to log in and discovers that they have forgotten their password
1. User clicks the "Forgot Password" link
1. User is redirected to the Send Reset Message page, from which they can:
   1. Enter their email address and press "Send Reset Instructions"
   1. Cancel and return to the login page
   1. Navigate to another accessible page

If the user chooses to receive emailed instructions, the following further steps are taken

1. User receives email which includes a link with an embedded token that is good for 30 minutes
1. User clicks link in email and is taken to the Reset Password Page
1. User enters a new password and a verification password which has the same requirements as when changing a password via the Change Password page
1. The user performs one of the following actions
   1. User selects "Change Password" to change the password
   1. User selects "Cancel" to return to the login screen
   1. User navigates to any accessible page

**Note:** The "Change Password" button is only available if the New Password and Verify Password fields meet all requirements for validity, including matching each other.

### Result

#### Cancel

If the user chooses to cancel at any step, they are returned to the login page. If an email has been sent, the link in that email shall remain valid for 30 minutes even if the operation has been cancelled.

#### Navigation

If the user chooses to navigate at any step, navigation proceeds as normal without error or warning. If an email has been sent, the link in that email shall remain valid for 30 minutes even if the reset page has been navigated away from.

#### Success

Upon a successful reset of the current password, a transitory message such as a toast shall be displayed indicating the success and the user shall be redirected to the login page.

#### Failure

Upon failure, the user shall be presented with the reason for the failure, at which point they _may_ be permitted to retry the operation. The most common reason for failure is that the link has expired. In that case, they shall not be permitted to retry the operation, but instead shall be given the option of receiving a new email with a new link.

## Task: Viewing All Users

### Pages

- User List

### User Steps

1. User with administrator access logs in
1. Users link is displayed in the menu
1. User click on the Users link

### Result

A page with a list of users is displayed. The administraor is allowed to perform the following actions:

- show/hide inactive users
- filter users by name
- add new users
- toggle the active/inactive status of a user

## Task: Adding a user

### Pages

- User List Page
- Add User Page

### User Steps

1. Administrator user views the user list
1. Administrator user clicks "Add User"
1. Administrator user is redirected to the Add User page
1. Administrator user fills out the information and performs one of the following actions
   1. selects "Add User"
   1. selects "Cancel"
   1. navigates

The following fields are required when creating a new user:

- First Name
- Last Name
- Email Address
- Initial Password

As this operation is inherantly insecure and the password should be changed by the user being created the password characters are not hidden and thus there is no need for a verificaton password.

### Result

#### Add User

Upon selecting add-user the following operations are performed:

1. the user data is POSTed creating the user
1. the initial password data is POSTed creating the initial password for the user

##### Success

Upon success, a transient message such as a toast is displayed indicating the success and the application navigates back to the user list page.

##### Failure

Upon failure, and appropriate message is displayed to the user, giving the user the chance to fix the issue and re-submit. Since the save of the user could succeed and the POST of the initial password code fail, the screen shall allow an UPDATE to be POSTed for the user information in such cases.

Since the creation of the user must succeed before the POST of the initial password information, it is not possible for the password post to succeed and not the user post.

#### Cancel

Upon cancel, the application goes back to the user list page.

## Task: Enabling and Disabling Users

### Pages

- User List Page

### User Steps

1. Administrator user goes to the User List Page
1. Administrator user toggles the Enabled checkbox on users
1. Administrator is not allowed to toggle own user to disabled
1. All toggling of user status is POSTed immediately

### Result

#### Success

Administrator user stays on User List Page. If the toggle is set to hide inactive users and a user is toggled inactive, then the user shall be removed from the list.

#### Failure

An error message is shown on screen in some appropriate manner where the user can see it.

## Task: Change User Password

This particular task may not be something that is done. This is still being debated.

# Tea User Stories

The main goal of this application is to store information about teas that I have tried and that I like. The following types of information shall be stored:

- Name
- Type (Category)
- Description (Notes)
- Brewing Instructions
- Rating
- Purchase Link(s) w/ approx price per 100g

The goal of this information is to then allow teas to be searched, displayed by category, or displayed by rating to allow for easier reordering

## Tasks

- [ ] adding a tea
- [ ] removing a tea
- [ ] displaying tea information (details on a single tea)
- [ ] updating a tea (main information)
- [ ] adding a purchase link
- [ ] rating a tea

## Task: Adding a tea

The most common way to know that you need to add a tea is that you looked for a tea and could not find it. This can be done via searching or browsing by category.

### Pages

- Home / Search
- Categories

### Steps

1. user attempts to find a tea in either the search or category page
1. user clicks the add button which is next to the search field in the search page or in each category header in the category page

### Result

A modal dialog is displayed that allows the user to enter the following information about the tea:

- Name (text input)
- Type (select list)
- Description (textarea)
- Brewing Instructions (testarea)
- Rating (a star rating component)
- Purchase Link (text input, validate for url)
- approx price per 100g (number input, use $ prefix label)

If the add was initiated from the Category page, the appropriate category shall be pre-selected but can be changed by the user

#### Success

- Tea is added to the database
- Modal is closed
- Page is update if appropriate

#### Failure

A message is displayed indicating the error.

#### Cancel

The cancel button shall always be active.

The user is asked if they would really like to cancel. If yes, the dialog is closed without the tea being added. If the answer is no, the modal is kept open.

## Task: Removing a Tea

It makes the most sense to allow the removal of teas from anywhere that a list of teas is displayed.

### Pages

- Home / Search
- Categories
- Ratings

### Steps

1. click on the remove button on a tea in the list
1. a yes/no alert is displayed asking if the user would like to remove the tea

### Result

If the user selects "Yes" the tea is removed and the list view is updated accordingly.

If the user selects "No" nothing occurs.

## Task: Displaying a Tea

### Pages

Each of the following pages shall show a list of teas. This list shall contain a minimal amount of information about each tea: name, type, rating

- Home / Search
- Categories
- Ratings

### Steps

1. click on a tea
1. see the tea

### Result

A page is displayed that shows all of the information about a tea with the following details:

- Name & Type as such: Lotus Blossom [Oolong]
- Rating
- Description (formatted)
- Brewing Instructions (formatted)
- Price: Average price per 100g
- Purchase Link(s) (as links)

#### Success

The display page is shown

#### Failure

The user is redirectred to some sort of error mage or an error alert is displayed

#### Done

A done button (or some such mechanism) shall exist that takes the user back to the list from where they came.

## Task: Updating a Tea

### Pages

- Tea Details

### Steps

1. click on the update button (or some such mechanism)
1. a modal is displayed that allows the tea to be updated

The following items are editable in this way:

- Name
- Type (Category)
- Description (Notes)
- Brewing Instructions
- Rating

## Task: Maintaining Purchase Links

### Pages

- Tea Details

### Details

The following actions shall be allowed:

1. add a link (master add button for whole list)
1. remove a link (some sort of button on each link)
1. edit a link (some sort of button on each link)

## Task: Rating a Tea

### Pages

- Home / Search
- Categories
- Ratings

### Steps

1. click the ratng indicator in any of the tea lists
1. the tea is updated immediately

### Result

Only the rating is updated

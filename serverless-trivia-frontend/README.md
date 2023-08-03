# Folder structure

## components

Add all the resuable components here. If you see a component being used twice anywhere, it should in the components folder.

## pages

If component need a route, then it should in the pages folder. Create a new folder with your page component and add all the components which are needed by your page in this folder.

## services

Api call functions here, do not do API call directly in the components. In this project since muli cloud will need lot of API calls so better handle it properly
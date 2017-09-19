const electron = require('electron');
const path     = require('path');
const url      = require('url');

const {app, BrowserWindow, Menu} = electron;
const mainMenuTemplate = generateMainMenuTemplate();

let mainWindow;
let addWindow;

setupMainWindow();

function setupMainWindow(){
	// Listen for app to be ready
	app.on('ready', function(){
		// Create new window
		mainWindow = new BrowserWindow({});
		// Load HTML into window
		// file://__dirname/mainWindow.html
		mainWindow.loadURL(url.format({
			pathname: path.join(__dirname, 'mainWindow.html'),
			protocol: 'file:',
			slashes: true
		}));
		// Quit app when closed
		mainWindow.on('closed', function(){
			app.quit();
		})

		// Build menu from template
		const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
		// Inset menu
		Menu.setApplicationMenu(mainMenu)

	})

	checkEnvironment();
}

function generateMainMenuTemplate(){
	return [
		{
			label: 'File',
			submenu: [
				{
					label: 'Add Item',
					click(){
						createAddWindow();
					}
				},
				{
					label: 'Clear Items'
				},
				{
					label: 'Quit',
					accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
					click(){
						app.quit();
					}
				}
			]
		}
	];
}

// Handle creation of Add window
function createAddWindow(){
// Create new window
	addWindow = new BrowserWindow({
		width: 300,
		height: 200,
		title: 'Add Shopping List Item'
	});
	// Load HTML into window
	// file://__dirname/addWindow.html
	addWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'addWindow.html'),
		protocol: 'file:',
		slashes: true
	}));
	// Garbage collection
	addWindow.on('close', function(){
		addWindow = null;
	})
}


function checkEnvironment(){
	adjustMenuForMacs();
	toggleDevToolsForDebug();
}
// Hack for proper menu display if user is on Mac
function adjustMenuForMacs(){
	if(process.platform == 'darwin'){
		mainMenuTemplate.unshift({});
	}
}

// Add developer tools if not in production
function toggleDevToolsForDebug(){
	if(process.env.NODE_ENV !== 'production'){
		mainMenuTemplate.push({
			label: 'Developer Tools',
			submenu: [
				{
					label: 'Toggle DevTools',
					accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
					click(item, focusedWindow){
						focusedWindow.toggleDevTools();
					}
				},
				{
					role: 'reload'
				}
			]
		});
	}
}
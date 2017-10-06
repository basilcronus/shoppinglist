const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({});

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file',
        slashes: true
    }));

mainWindow.on('closed', () => {
    app.quit();
});


    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

function createAddWindow(){
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Shopping List Item'

    });
    
    addWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'addWindow.html'),
            protocol: 'file',
            slashes: true
        }));

        addWindow.on('close', () => {
            addWindow = null;
        });
    
        const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
        Menu.setApplicationMenu(mainMenu);
}

ipcMain.on('item:add', (e, item) => {    
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
})


const mainMenuTemplate = [
{
    label:'File',
    submenu: [
        {
            label: 'Add Item',
            click() {
                createAddWindow()
            }
        },
        {
            label: 'Clear Items'
        },
        {
            label: 'Quit',
            accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
            click(){
                app.quit();
            }
        }
    ]
}
];

if(process.platform === 'darwin'){
    mainMenuTemplate.unshift({});
}

if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Command+I' : 'Ctrl+I',
        submenu: [
            {
                label: 'Toggle DevTools',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}
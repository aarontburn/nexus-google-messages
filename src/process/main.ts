import { Process } from "@nexus-app/nexus-module-builder"
import { session } from "electron";
import path from 'path';

// These is replaced to the ID specified in export-config.js during export. DO NOT MODIFY.
const MODULE_ID: string = "{EXPORTED_MODULE_ID}";
const MODULE_NAME: string = "{EXPORTED_MODULE_NAME}";
// ---------------------------------------------------



// If you have an icon, specify the relative path from this file.
// Can be a .png, .jpeg, .jpg, or .svg
/*
    const ICON_PATH: string = path.join(__dirname, "../path to image")
*/

const ICON_PATH: string = undefined;

export default class SampleProcess extends Process {


    private partition: string = `persist:${MODULE_ID}`;

    // This user agent should work on most websites.
    private userAgent: string = session.fromPartition(this.partition)
        .getUserAgent().replace(/Electron\/*/, '')

    /**
     *  The constructor. Should not directly be called, 
     *      and should not contain logic relevant to the renderer.
     */
    public constructor() {
        super({
            moduleID: MODULE_ID,
            moduleName: MODULE_NAME,
            paths: {
                iconPath: ICON_PATH,
                htmlPath: path.join(__dirname, "../renderer/index.html"),
            }
        });

        // Alternative method:
        // If you simply want to embed a website quickly but have no control over it,
        // uncomment this and remove the other super(...). You can also delete
        // the initialize() function, handleEvent() function, and the ../renderer folder
        // as they will be unused.

        // super({
        //     moduleID: MODULE_ID,
        //     moduleName: MODULE_NAME,
        //     paths: {
        //         iconPath: ICON_PATH,
        //         urlPath: "https://www.nexus-app.net/develop/"
        //     },
        //     httpOptions: {
        //         userAgent: this.userAgent,
        //         partition: this.partition
        //     }
        // });
    }


    public async initialize(): Promise<void> {
        this.sendToRenderer("user-agent", {
            userAgent: this.userAgent,
            partition: this.partition,
        });
    }


    public async handleEvent(eventType: string, data: any[]): Promise<any> {
        switch (eventType) {
            case "init": { // This event is sent from the ../renderer/renderer.ts when the frontend is ready.
                this.initialize();
                break;
            }
            default: {
                console.warn(`[${MODULE_NAME}] Uncaught message: ${eventType} | ${data}`);
                break;
            }
        }
    }

}
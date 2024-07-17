/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";
import * as d3 from 'd3';


import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import { VisualFormattingSettingsModel } from "./settings";

export class Visual implements IVisual {
    private target: HTMLElement;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;
    private url : string;
    private iframe: d3.Selection<HTMLIFrameElement, unknown, null, undefined>;

    constructor(options: VisualConstructorOptions) {
        this.formattingSettingsService = new FormattingSettingsService();
        this.target = options.element;
        this.url = "";
    }

    public isValidURL(str: string): boolean {
        try {
            const url = new URL(str);
            return url.protocol === "https:" || url.protocol === "http:";
        } catch (error) {
            return false;
        }
    }

    
    public update(options: VisualUpdateOptions) {
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews[0]);

        const optionUpdateType = options.type
        if ((optionUpdateType & (powerbi.VisualUpdateType.Resize | powerbi.VisualUpdateType.ResizeEnd | powerbi.VisualUpdateType.ViewMode)) !== 0) {
            return;
        }

        if(options.dataViews[0].single) {
            console.log("Using Data Role URL.")
            this.url = options.dataViews[0].single.value as string
        }
        else {
            console.log("Using Formating URL.")
            this.url = this.formattingSettings.dataCard.persist.value as string
        }

        d3.select(this.target).selectAll('*').remove(); 

        if (this.isValidURL(this.url)) {
            console.log("URL Validated.")
            this.iframe = d3.select(this.target).append("iframe")
                .attr("width", "100%")
                .attr("height", "100%")
                .style("border", "none")
                .attr("src", this.url)
                .attr("allowfullscreen", "true")
                .attr("overflow", "none");
        }
        else {
            const errorMessage = d3.select(this.target)
                .append("div")
                .append("p")
                .text("Wrong URL.")

            console.log("Wrong URL.")
        }

        console.log(options.type)

    }

    /**
     * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
     * This method is called once every time we open properties pane or when the user edit any format property. 
     */
    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}
# powerbi-visuals-iframe
 powerbi-visuals-iframe

 This custom visual for Power BI allows you to create an iframe to integrate any external web application within a report.
### Setting Up Environment

Before starting creating your first custom visual follow by [this](https://learn.microsoft.com/en-us/power-bi/developer/visuals/environment-setup)
setting up environment instruction.


### Install dev dependencies:

Once you have cloned this repository, run these commands to install dependencies and to connect the visual into powerbi.

```
npm install # This command will install all necessary modules
```

### Start dev app
```
pbiviz start
```

### Adapt the visual

In order for the visual to work with your web applications, you need to modify the *capabilitions.json* file to change the visual's privileges.

```
    "privileges": [
        {
            "name": "WebAccess",
            "essential": true,
            "parameters": [
                "DOMAIN1",
                "DOMAIN2"
            ]
        }
    ]
```

Adapt this part by replacing it with your domains, for example:

```
    "privileges": [
        {
            "name": "WebAccess",
            "essential": true,
            "parameters": [
                "https://*.microsoft.com",
                "http://example.com"
            ]
        }
    ],
```

### Package the visual

Once you've finished updating the visual, you can package it by running:

```
pbiviz package
```

And find the *.pbiviz* file in the *dist* folder.

Now, you can import it into your own reports.

### Considerations and Limitations

I recommend you to try the visual both in Power BI Desktop and in Power BI Service.

Sometimes access to certain domains is not guaranteed 

### How the visual works

There are two ways to set the URL to be integrated into the Iframe:
1. Data Roles
2. Formatting pane

Data Roles (with measures for example) have priority over formatting settings.

The URL must be valid and includes **https://** or **http://**
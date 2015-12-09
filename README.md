
```
Project root
├─── README.md
├─── index.html   (menu)
├─── .htaccess
│
└───assets
    │
    ├─── css
    │   ├─── libs 
    │   │   ├─── [ styles for plugins ]
    │   │   ├─── _mixins.scss
    │   │   └─── _variables.scss
    │   ├─── framework files
    │   ├─── pages [ contains scss files that describe pages, starts with '_' ]
    │   ├─── components [ contains scss files that describe sections, starts with '_' )
    │   └─── global.scss
    │
    ├─── fonts
    │
    ├─── js
    │   ├─── modules
    │   │   └─── [functions separated on different modules(files)]
    │   ├─── services
    │   │   └─── [files with service and helping functions]
    │   ├─── bundles
    │   │   └─── [files with dependencies from node modules ]
    │   └─── global.js
    │
    ├─── images
    │   └─── temp [temporary images]
    │
    └─── html
        ├─── [non compiled html files]
        └─── templates (html sections)
```
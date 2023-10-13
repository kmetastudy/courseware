export var mtvElementBuilder = {
    
    camelCase : function(s){
        return s.replace(/-(.)/g, function(a, $1){return $1.toUpperCase();});
    },
    
    deCase : function(s) {
        return s.replace(/[A-Z]/g, function(a) {return '-' + a.toLowerCase()});
    },
    
    createElement  : function(tag)
    {
        if(!tag['tag'])
            return document.createTextNode(tag['text'] || 'nothing');

        var element = document.createElement(tag['tag']);

        if(tag['class'])
            element.setAttribute('class',tag['class']);

        if(tag['id'])
            element.setAttribute('id',tag['id']);
        if(tag['placeholder'])
            element.setAttribute('placeholder', tag['placeholder']);

        if(tag['attr'])
        {
            var keys = Object.keys(tag['attr']);

            for(var i=0; i<keys.length;i++)
            {
                element.setAttribute(keys[i],tag['attr'][keys[i]]);
            }
        }

        if(tag['prop'])
        {
            var keys = Object.keys(tag['prop']);

            for(var i=0; i<keys.length;i++)
            {
                element.setAttribute(keys[i],true);
            }
        }

        if(tag['text'])
            element.innerHTML = tag['text'];

        return element;
    },

    createComponent : function(tagList)
    {
        // console.log('tagList : ',tagList);
        var topElement = null;
        var componentList = [];
        var level = 0;
        var element = null;
        if(tagList)
        {
            for(var i=0; i<tagList.length;i++)
            {
                element = this.createElement(tagList[i]);
                if(i==0)
                {
                    topElement = element;
                    componentList.push(element);
                }
                else
                {
                    level = tagList[i]["level"];
                    
                    componentList[level-1].appendChild(element);
                    componentList[level] = element;
                }
            }

        }

        return topElement;
        
    },

    // buildComponent with depth
    buildComponent : function(tagList, bCompList)
    {
        var topElement = null;
        var componentList = [];
        var depth = 0;
        var element = null;
        var elCompList = [];

        if(tagList)
        {
            for(var i=0; i<tagList.length;i++)
            {
                if(tagList[i]['invalid'])
                    continue;
                element = this.createElement(tagList[i]);
                if(i==0)
                {
                    topElement = element;
                    componentList.push(element);
                }
                else
                {
                    depth += tagList[i]['step'];
                    
                    if(depth == 0)
                        continue;
                    
                    if(componentList[depth-1])
                        componentList[depth-1].appendChild(element);
                    componentList[depth] = element;
                }

                if(bCompList)
                    elCompList.push(element);
            }

        }

        return elCompList;
    },

    create : function(tagList)
    {
        var topElement = document.createElement('div');
        
        // topElement.setAttribute('class','mtv-top-element');

        var componentList = [];
        var level = 0;
        var element = null;
    
        componentList.push(topElement);

        if(tagList)
        {
            for(var i=0; i<tagList.length;i++)
            {
                element = this.createElement(tagList[i]);
                level = tagList[i]["level"];
                
                componentList[level].appendChild(element);
                componentList[level+1] = element;
                
            }
        }

        return topElement;
    },

    // return {
    //     create : create,
    //     createElement : createElement,
    //     createComponent : createComponent,
    //     buildComponent : buildComponent,

    //     camelCase : camelCase,
    //     deCase : deCase,
    // }
}
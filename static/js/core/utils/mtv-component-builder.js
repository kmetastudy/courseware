// Dynamic Component Builder 를 만들어 보았다.
// Events Pub/Sub Model로 해보았다.
// 천재의 숨결이 느껴진다.
export var mtvComponentBuilder = {
    components : {},
    register : function(compName,compFunc)
    {
        // this.components[compName] = this.components[compName] || [];
        this.components[compName] = compFunc;
    },
    build : function(compName,options)
    {
        if(this.components[compName])
        {
            // console.log('mtvComponentBuilder : ', this.components[compName]);
            return new this.components[compName](options);
        }
        else
            null;
    },
};

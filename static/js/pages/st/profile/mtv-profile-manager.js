import {mtvProfileContainer} from './mtv-profile-container.js';
import {mtvProfileBuilder} from './mtv-profile-builder.js';

export var mtvProfileManager = {
    objects : {
        
        id : null,

        initLeftTab : false,
        initRightTab : false,

        // Profile Container  
        profileContainerId : null,
        clProfileContainer : null,

        // Profile Builder
        profileBuilderId : null,
        clProfileBuilder : null,
        
        
    },

    leftTabTitle : "내 정보",
    leftTabDiv : null,
    leftTabScroll : 0,
    leftTabGap : "px-0",
    leftTabDivTree : [
                {'level':0,'tag':'div', 'class':'col-12','id':'profile-container-1',},
            ],

            
    rightTabTitle : "내 정보",
    rightTabDiv : null,
    rightTabGap : "px-0",
    rightTabScroll : 0,
    rightTabDivTree : [
                {'level':0,'tag':'div', 'class':'row',},
                    {'level':0,'tag':'div', 'class':'col-12 px-0','id':'profile-builder-1',},
            ],


    initContainer : function()
    {
        this.objects.profileContainerId = 'profile-container-1';
        this.objects.clProfileContainer = new mtvProfileContainer(this.objects.profileContainerId, null);
    },

    initBuilder : function()
    {
        this.objects.profileBuilderId = 'profile-builder-1';
        this.objects.clProfileBuilder = new mtvProfileBuilder(this.objects.profileBuilderId,null);
        // objects.clClassBuilder.init();
    },

    
    init : function()
    {
        // console.log('mtv-scheduler-manager');
        // mtvEvents.on('OnNewScheduler', onNewScheduler);
        // mtvEvents.on('OnOldScheduler', onOldScheduler);
    },

    onNewProfile : function()
    {
        // console.log('mtvSchedulerManager : onNewScheduler');
        this.objects.clProfileBuilder.onNewProfile();
    },

    onOldProfile : function()
    {
        this.objects.clProfileBuilder.onOldProfile();
    },

    getLeftTab : function(tabList)
    {
        tabList.tabTitle.push(this.leftTabTitle);
        tabList.tabDiv.push(this.leftTabDiv);
        tabList.tabGap.push(this.leftTabGap);
        tabList.tabScroll.push(this.leftTabScroll);
        tabList.tabDivTree.push(this.leftTabDivTree);
        
    },

    getRightTab : function(tabList)
    {
        tabList.tabTitle.push(this.rightTabTitle);
        tabList.tabDiv.push(this.rightTabDiv);
        tabList.tabGap.push(this.rightTabGap);
        tabList.tabScroll.push(this.rightTabScroll);
        tabList.tabDivTree.push(this.rightTabDivTree);
        
    },

    activateLeftTab : function()
    {
        if(!this.objects.initLeftTab)
        {
            this.objects.initLeftTab = true;

            this.initContainer();

            // objects.elQuestionContainer.test();
            // init();
        }
    },

    activateRightTab : function()
    {
        if(!this.objects.initRightTab)
        {
            this.objects.initRightTab = true;
            this.initBuilder();
        }
    },

    getLeftTabTitle : function() {
        return this.leftTabTitle;
    },
    getRightTabTitle : function() {
        return this.rightTabTitle;
    }

    // return {
    //     init : init ,
        
    //     getLeftTab : getLeftTab,
    //     getRightTab : getRightTab,
    //     activateLeftTab : activateLeftTab,
    //     activateRightTab : activateRightTab,
        
    //     getLeftTabTitle : getLeftTabTitle,
    //     getRightTabTitle : getRightTabTitle,
    // };
}


class DomHelper {

    static clearEventListeners(element){
        const  clonedElement=element.cloneNode(true);
        element.replaceWith(clonedElement);
        return clonedElement
    }
    static moveElement(elementId, newDestinationSelector) {
        const element = document.getElementById(elementId);
        const destinationElement = document.querySelector(newDestinationSelector);
        destinationElement.append(element);
        element.scrollIntoView({behavior:'smooth'});
    }
}

class Component {
    constructor(hostElementId, insertBefore = false) {
        if (hostElementId) {
            this.hostElement = document.getElementById(hostElementId);
        } else {
            this.hostElement = document.body;
        }
        this.insertBefore = insertBefore;
    }

    detach() {
        if (this.element) {
            this.element.remove();
        }
        // this.element.parentElement.remove()
    }

    attach() {
        //document.body.append(this.element);

        this.hostElement.insertAdjacentElement(
            this.insertBefore ? 'beforebegin' : 'beforeend', this.element);
    }
}

class Tooltip extends Component {

    constructor(closeNotifierFunction,text, hostElementId) {
        super(hostElementId);
        this.closeNotifier = closeNotifierFunction;
        this.text=text;
        this.create();
    }

    closeTooltip = () => {
        this.detach();
        this.closeNotifier();
    }

    create() {
        const tooltipElement = document.createElement('div');
        tooltipElement.className = 'card';
        //tooltipElement.textContent =this.text;
        const tooltipTemplate=document.getElementById('tooltip');
        const tooltipBody=document.importNode(tooltipTemplate.content,true);
        tooltipBody.querySelector('p').textContent=this.text;
        tooltipElement.append(tooltipBody);
        //tooltipElement.innerHTML=``;

        const hostElPosLeft=this.hostElement.offsetLeft;
        const hostElPosTop=this.hostElement.offsetTop;
        const hostElHeight=this.hostElement.clientHeight;
        const parentElementScrollig=this.hostElement.parentElement.scrollTop;

        const x=hostElPosLeft+20;
        const y=hostElPosTop+hostElHeight-parentElementScrollig-10;
        console.log('y::'+y)
        tooltipElement.style.position='absolute';
        tooltipElement.style.left=x+'px';
        tooltipElement.style.top=y+'px';



        tooltipElement.addEventListener('click', this.closeTooltip);
        this.element = tooltipElement;
    }

}

class ProjectItem {
    hasActiveTooltip = false;

    constructor(id, updateProjectListsFunction,type) {
        this.id = id;
        this.updateProjectListsHandler = updateProjectListsFunction;
        this.connectMoreInfoButton();
        this.connectSwitchButton(type);
    }

    showMoreInfoHandler() {
        if (this.hasActiveTooltip) {
            return;
        }
        const projectElement=document.getElementById(this.id);
        const tooltipText=projectElement.dataset.extraInfo;
        console.log(tooltipText)
        const tooltip = new Tooltip(() => {
            this.hasActiveTooltip = false;
        },tooltipText,this.id);
        tooltip.attach();
        this.hasActiveTooltip = true;
    }

    connectMoreInfoButton() {
        const projectItemElement = document.getElementById(this.id);
        let moreInfoBtn = projectItemElement.querySelector('button:first-of-type');
        moreInfoBtn.addEventListener('click', this.showMoreInfoHandler.bind(this));
    }

    connectSwitchButton(type) {
        const projectItemElement = document.getElementById(this.id);
        let switchBtn = projectItemElement.querySelector('button:last-of-type');
        switchBtn = DomHelper.clearEventListeners(switchBtn);
        switchBtn.textContent = type === 'active' ? 'Finish' : 'Activate';
        switchBtn.addEventListener("click", this.updateProjectListsHandler.bind(null, this.id));
    }
    update(updateProjectListsFn, type) {
        this.updateProjectListsHandler = updateProjectListsFn;
        this.connectSwitchButton(type);
    }
}

class ProjectList {
    projects = [];

    constructor(type) {
        this.type = type;

        const items = document.querySelectorAll(`#${type}-projects li`);
        /*items.forEach(item => {
                this.projects.push(new ProjectItem(item.id));
            });*/
        for (const item of items) {
            console.log(item.id);
            this.projects.push(new ProjectItem(item.id, this.switchProject.bind(this),type));
        }
        //console.log(this.projects);
    }

    setSwitchHandlerFunction(switchHandlerFunction) {
        this.switchHandler = switchHandlerFunction;
    }

    addProject(project) {
        //console.log(project)
        this.projects.push(project);
        DomHelper.moveElement(project.id, `#${this.type}-projects ul`);
        project.update(this.switchProject.bind(this),this.type)
    }

    switchProject(projectId) {
        //const index=this.projects.findIndex(p=>p.id===projectId);
        //this.projects.splice()
        this.switchHandler(this.projects.find(p => p.id === projectId))
        this.projects = this.projects.filter(p => p.id !== projectId);
    }

}

class App {

    static init() {
        const activeProjectList = new ProjectList('active')
        const finishedProjectList = new ProjectList('finished');
        activeProjectList.setSwitchHandlerFunction(
            finishedProjectList.addProject.bind(finishedProjectList)
        );
        finishedProjectList.setSwitchHandlerFunction(
            activeProjectList.addProject.bind(activeProjectList) );

        /*const someScript=document.createElement('script');
        someScript.textContent='alert("Hi Loading Dynamic Script!");';
        document.head.append(someScript);*/
        //this.processingAnalytics();
        setTimeout(this.processingAnalytics,3000)
    }
    static processingAnalytics(){
        const analyticsScript=document.createElement('script');
        analyticsScript.src='assets/scripts/analytics.js';
        analyticsScript.defer=true;
        document.head.append(analyticsScript);
    }
}

App.init();
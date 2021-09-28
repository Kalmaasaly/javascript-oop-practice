class DomHelper{
    static moveElement(elementId,newDestinationSelector){
        const element=document.getElementById(elementId);
        const destinationElement=document.querySelector(newDestinationSelector);
        destinationElement.append(element);
    }
}

class Tooltip {

}

class ProjectItem {
    constructor(id,updateProjectListsFunction) {
        this.id = id;
        this.updateProjectListsHandler=updateProjectListsFunction;
        this.connectMoreInfoButton();
        this.connectSwitchButton();
    }

    connectMoreInfoButton() {
    }

    connectSwitchButton() {
        const projectItemElement = document.getElementById(this.id);
        let switchBtn = projectItemElement.querySelector('button:last-of-type');
        switchBtn.addEventListener("click",this.updateProjectListsHandler.bind(this,this.id));
    }
}

class ProjectList {
    projects = [];

    constructor(type) {
        this.type=type;

        const items = document.querySelectorAll(`#${type}-projects li`);
        /*items.forEach(item => {
                this.projects.push(new ProjectItem(item.id));
            });*/
        for (const item of items) {
            console.log(item.id);
            this.projects.push(new ProjectItem(item.id,this.switchProject.bind(this)));
        }
        //console.log(this.projects);
    }
    setSwitchHandlerFunction(switchHandlerFunction){
        this.switchHandler=switchHandlerFunction;
    }
    addProject(project) {
        //console.log(project)
        this.projects.push(project);

        DomHelper.moveElement(project.id,`#${this.type}-projects ul`);
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
            activeProjectList.addProject.bind(activeProjectList)
        );
    }
}

App.init();
class DomHelper {
    static moveElement(elementId, newDestinationSelector) {
        const element = document.getElementById(elementId);
        const destinationElement = document.querySelector(newDestinationSelector);
        destinationElement.append(element);
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

    constructor(closeNotifierFunction) {
        super('active-projects');
        this.closeNotifier = closeNotifierFunction;
        this.create();
    }

    closeTooltip = () => {
        this.detach();
        this.closeNotifier();
    }

    create() {
        const tooltipElement = document.createElement('div');
        tooltipElement.className = 'card';
        tooltipElement.textContent = 'card';
        tooltipElement.addEventListener('click', this.closeTooltip);
        this.element = tooltipElement;
    }

}

class ProjectItem {
    hasActiveTooltip = false;

    constructor(id, updateProjectListsFunction) {
        this.id = id;
        this.updateProjectListsHandler = updateProjectListsFunction;
        this.connectMoreInfoButton();
        this.connectSwitchButton();
    }

    showMoreInfoHandler() {
        if (this.hasActiveTooltip) {
            return;
        }
        const tooltip = new Tooltip(() => {
            this.hasActiveTooltip = false;
        });
        tooltip.attach();
        this.hasActiveTooltip = true;
    }

    connectMoreInfoButton() {
        const projectItemElement = document.getElementById(this.id);
        let moreInfoBtn = projectItemElement.querySelector('button:first-of-type');
        moreInfoBtn.addEventListener('click', this.showMoreInfoHandler);
    }

    connectSwitchButton() {
        const projectItemElement = document.getElementById(this.id);
        let switchBtn = projectItemElement.querySelector('button:last-of-type');
        switchBtn.addEventListener("click", this.updateProjectListsHandler.bind(null, this.id));
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
            this.projects.push(new ProjectItem(item.id, this.switchProject.bind(this)));
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
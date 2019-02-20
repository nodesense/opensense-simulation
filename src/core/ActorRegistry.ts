class ActorRegistry {
    actorTypeMap: any = {};

    registerActor(name: string, type: any) {
        this.actorTypeMap[name] = type;
    }


    getActorType (name: string) {
        return  this.actorTypeMap[name]
    }
}

const actorRegistry = new ActorRegistry();
export default actorRegistry;
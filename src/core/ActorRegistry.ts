class ActorRegistry {
    actorTypeMap: any = {};
    registerActor(name: string, type: any) {
        console.log(name," Actor Added ");
        this.actorTypeMap[name] = type;
    }
    getActorType (name: string) {
        return  this.actorTypeMap[name]
    }
}
const actorRegistry = new ActorRegistry();
export default actorRegistry;
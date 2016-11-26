var constructor = {
    run: function(creep){
        if(creep.carry.energy == 0){
            targets = creep.room.find(FIND_DROPPED_ENERGY, {
                filter: function(targets){ return targets.energy >= creep.energyCapacity }
            });
            if(targets.length){
                target = creep.pos.findClosestByRange(targets);
                if(creep.pickup(target) == ERR_NOT_IN_RANGE){
                    creep.moveTo(target);
                }
            } else {
                targets = creep.room.find(FIND_STRUCTURES,{
                    filter: function(targets){ return targets.structureType == STRUCTURE_STORAGE && targets.store[RESOURCE_ENERGY] > creep.carryCapacity } 
                });
                target = creep.pos.findClosestByRange(targets);
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(target);
                }
            }
        } else {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length){
                if(ERR_NOT_IN_RANGE == creep.build(targets[0])){
                    creep.moveTo(targets[0]);
                }
            } else {
               creep.moveTo(Game.flags["idleConstructors"]);
            }
        }
    }
}

module.exports = constructor;
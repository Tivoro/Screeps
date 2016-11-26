var harvester = require('role.harvester');
var builder = require('role.builder');
var constructor = require('role.constructor');
var repairer = require('role.repairer');
var trucker = require('role.trucker');

var tower = require('struct.tower');

var createUnits = require('handler.units');
var roomHandler = require('handler.room');
var armyHandler = require('handler.army');

var warriors = require('attack.melee');

var outposts = require('expansion.outpost');
var helperHandler = require('helper.handler');


module.exports.loop = function () {
    //Ska hantera outposts
    outposts.run();
    //armyHandler.run();
    //helperHandler.run();
    for(var spawn in Game.spawns){
        var currRoom = Game.spawns[spawn].room;
        roomHandler.run(currRoom);
        createUnits.run(spawn);
    }
    for(var id in Game.structures){
        if(Game.structures[id].structureType == STRUCTURE_TOWER){
            tower.run(Game.structures[id]);
        }
    }
    for(var cName in Game.creeps){
        var creep = Game.creeps[cName];
        var cRole = Game.creeps[cName].memory.role;
        switch(cRole){
            case "harvester":
                harvester.run(creep);
                break;
            case "builder":
                builder.run(creep);
                break;
            case "constructor":
                constructor.run(creep);
                break;
            case "repairer":
                repairer.run(creep);
                break;
            case "trucker":
                trucker.run(creep);
                break;
            case "logTrucker":
                trucker.logTrucker(creep);
                break;
            case "storTrucker":
                trucker.storTrucker(creep);
                break;
            case "healer":
                warriors.run(creep);
                break;
            case "beef":
                warriors.run(creep);
                break;
            case "melee":
                warriors.run(creep);
                break;
            default:
                //console.log("Unknown creep");
                break;
        }
        
    }
}
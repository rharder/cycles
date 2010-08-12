var dmz =
   { defs: require("dmz/runtime/definitions")
   , mask: require("dmz/types/mask")
   , objectType: require("dmz/runtime/objectType")
   , vector: require("dmz/types/vector")
   , isect: require("dmz/components/isect")
   , event: require("dmz/components/event")
   , eventCommon: require("dmz/components/eventCommon")
   , util: require("dmz/types/util")
   }


   , GameWaiting = dmz.defs.lookupState ("Game_Waiting")
   , GameCountdown5 = dmz.defs.lookupState ("Game_Countdown_5")
   , GameCountdown4 = dmz.defs.lookupState ("Game_Countdown_4")
   , GameCountdown3 = dmz.defs.lookupState ("Game_Countdown_3")
   , GameCountdown2 = dmz.defs.lookupState ("Game_Countdown_2")
   , GameCountdown1 = dmz.defs.lookupState ("Game_Countdown_1")
   , GameActive = dmz.defs.lookupState ("Game_Active")

   , Dead = dmz.defs.lookupState("Dead")
   , Standby = dmz.defs.lookupState("Standby")
   , EngineOn = dmz.defs.lookupState("Engine_On")

   , CycleType = dmz.objectType.lookup("cycle")
   , MCPType = dmz.objectType.lookup("mcp")
   , StartPointType = dmz.objectType.lookup("start_point")
   , WaitPointType = dmz.objectType.lookup("wait_point")
   , RedType = dmz.objectType.lookup("red_cycle")
   , OrangeType = dmz.objectType.lookup("orange_cycle")
   , YellowType = dmz.objectType.lookup("yellow_cycle")
   , BlueType = dmz.objectType.lookup("blue_cycle")
   ;

dmz.util.defineConst(exports, "GameWaiting", GameWaiting);
dmz.util.defineConst(exports, "GameCountdown5", GameCountdown5);
dmz.util.defineConst(exports, "GameCountdown4", GameCountdown4);
dmz.util.defineConst(exports, "GameCountdown3", GameCountdown3);
dmz.util.defineConst(exports, "GameCountdown2", GameCountdown2);
dmz.util.defineConst(exports, "GameCountdown1", GameCountdown1);

dmz.util.defineConst(exports, "GameActive", GameActive);


dmz.util.defineConst(exports, "GameStateMask", GameWaiting.or(GameActive).or
                     (GameCountdown1).or(GameCountdown2).or(GameCountdown3).or
                     (GameCountdown4).or(GameCountdown5));


dmz.util.defineConst(exports, "Dead", Dead);
dmz.util.defineConst(exports, "Standby", Standby);
dmz.util.defineConst(exports, "EngineOn", EngineOn);
dmz.util.defineConst(exports, "CycleState", Dead.or(Standby).or(EngineOn));
dmz.util.defineConst(exports, "EmptyState", dmz.mask.create ());

dmz.util.defineConst(exports, "TimeStampHandle",
                     dmz.defs.createNamedHandle("MCP_Running_Time"));
dmz.util.defineConst(exports, "StartLinkHandle",
                     dmz.defs.createNamedHandle("Start_Position"));
dmz.util.defineConst(exports, "DroneHandle", dmz.defs.createNamedHandle("Drone_Flag"));
dmz.util.defineConst(exports, "KillsHandle", dmz.defs.createNamedHandle("Kills"));
dmz.util.defineConst(exports, "WinsHandle", dmz.defs.createNamedHandle("Wins"));
dmz.util.defineConst(exports, "DeathsHandle", dmz.defs.createNamedHandle("Deaths"));

dmz.util.defineConst(exports, "CycleType", CycleType);
dmz.util.defineConst(exports, "MCPType", MCPType);
dmz.util.defineConst(exports, "StartPointType", StartPointType);
dmz.util.defineConst(exports, "WaitPointType", WaitPointType);
dmz.util.defineConst(exports, "RedType", RedType);
dmz.util.defineConst(exports, "OrangeType", OrangeType);
dmz.util.defineConst(exports, "YellowType", YellowType);
dmz.util.defineConst(exports, "BlueType", BlueType);

dmz.util.defineConst(exports, "CycleTypeList",
                     [ RedType, OrangeType, YellowType, BlueType ]);

dmz.util.defineConst(exports, "Right", dmz.vector.Right);
dmz.util.defineConst(exports, "Left", dmz.vector.create(-1, 0, 0));
dmz.util.defineConst(exports, "Up", dmz.vector.Up);
dmz.util.defineConst(exports, "Forward", dmz.vector.Forward);

exports.testMove = function (obj, origPos, pos, ori) {
   var result = true
     , deathPoint
     , target
     , left
     , right
     , wiskerResults
     , isectResults
     , state
     , Event
     ;

   if (obj) {
      dmz.isect.disable (obj);
      deathPoint = null;
      target = null;
      left = ori.transform(Left.multiply(0.6)).add(pos);
      right = ori.transform(Right.multiply(0.6)).add(pos);
      wiskerResults = dmz.isect.doIsect ( { start: origPos, direction: pos });
      if (wiskerResults && wiskerResults[0]) {

         deathPoint = wiskerResults[0].point;
         target = wiskerResults[0].obj;
         result = false;
      }
      else {

         origPos = origPos.add(0, 0.5, 0);
         pos = pos.add(0, 0.5, 0);
         isectResults = dmz.isect.doIsect({ start: origPos, vector: pos });
         if (isectResults && isectResults[0]) {

            deathPoint = isectResults[0].point;
            target = isectResults[0].obj;
            result = false;
         }
      }
      if (deathPoint) {

         state = dmz.object.state (obj);
         if (!state) { state = dmz.mask.create () }
         state = state.unset (CycleState);
         state = state.or(Dead);
         dmz.object.state (obj, null, state);
         dmz.object.velocity (obj, null, [0, 0, 0]);
         Event = dmz.eventCommon.createOpenCollision (obj, target);
         dmz.eventCommon.position (Event, null, deathPoint);
         dmz.eventCommon.close (Event);
      }
      dmz.isect.enable (obj);
   }
   return result;
}

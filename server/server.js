//TODO publish only loops which are public and loops which belong to the
// current user
Meteor.publish("loops", function () {
  return Loops.find();
});

Meteor.methods({

    addLoop: function(){
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        var loopId = Loops.insert({
            owner: this.userId,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return loopId;
    },

    //TODO Check that the current user owns the loop
    saveLoop: function(loopId, loopDefinition) {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        Loops.update(loopId, {$set: {definition: loopDefinition, updatedAt: new Date()}});
    }

});

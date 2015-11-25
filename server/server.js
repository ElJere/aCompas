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
            createdAt: new Date(),
            owner: this.userId
        });
        return loopId;
    }
});

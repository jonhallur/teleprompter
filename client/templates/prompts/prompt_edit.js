/**
 * Created by jonhallur on 30.4.2015.
 */
Template.promptEdit.helpers({
    fixedDate: function () {
        return this.submitted.toLocaleDateString();
    }
});

Template.promptEdit.onDestroyed(function () {
    $("textarea").sceditor("instance").destroy();
});

Template.promptEdit.rendered = function() {
    $(function() {
        $("textarea").sceditor({
            plugins: "bbcode",
            style: "minified/jquery.sceditor.default.min.css",
            resizeEnable: false,
            toolbar: "bold,italic,underline|left,center,right,justify|size,color",
            colors:
                "#000000,#000080,#008000,#800000" +
                "|#444444,#800080,#008080,#808000" +
                "|#888888,#cc00cc,#00cccc,#cccc00" +
                "|#cccccc,#ff00ff,#00ffff,#ffff00"
        });
    });

};

Template.promptEdit.events({
    'click .save-prompt': function(event, template) {
        event.preventDefault();

        var currentPromptId = this._id;

        var promptProperties = {
            //text: template.find('[name=prompt-text]').value
            text: $("textarea").sceditor("instance").val()
        };
        Prompts.update(currentPromptId, {$set: promptProperties}, function(error) {
            if (error) {
                // display the error to the user
                alert(error.reason);
            } else {
                Router.go('promptPage', {_id: currentPromptId});
            }
        });
    },
    'click .exit-edit': function(event, template) {
        event.preventDefault();
        Router.go('promptPage', {_id: this._id});
    },
    'keyup #prompt-text': _.throttle(function(event) {
        console.log("stuff");
    }, 300)
});



function SelectedSolvents(initialSolvent) {
    var self = this;
    self.selectedSolvent = ko.observable(initialSolvent);
    self.mass = ko.observable(initialSolvent.mass).extend({
        required:true,
        number: true
            });
    self.nrH = ko.observable(initialSolvent.standardnrH).extend({
        required: true,
        number: true
    });
    self.selectedSolvent.subscribe(function () {
        self.mass(self.selectedSolvent().mass);
        self.nrH(self.selectedSolvent().standardnrH);
    });
    self.integral = ko.observable(initialSolvent.integral ? initialSolvent.integral : 0).extend({
        required: true,
        number: true
    });
   
    self.selectSolvent = function (solvent) {
        self.selectedSolvent(solvent);
    };
    self.relativeH = ko.computed(function () {
        var integral = parseFloat(self.integral());
        if (isNaN(integral)) {
            integral = 0;
        }
        var nrH = parseFloat(self.nrH());
        if (isNaN(nrH)) {
            return 0;
        }
        else {
            if (nrh = 0) {
                return 0;
            }
            else {
                return integral / nrH;
            }
        }

    });
    self.molPercentage = ko.observable(0);
    self.molPercentageFormatted = ko.computed(function () {
        var percentage = self.molPercentage() * 100;
        return percentage.toFixed(2);
    });
    self.massPercentage = ko.observable(0);
    self.weightPercentage = ko.observable(0);
    self.weightPercentageFormatted = ko.computed(function () {
        var percentage = self.weightPercentage() * 100;
        return percentage.toFixed(2);
    });
    self.errors = ko.validation.group(self);
    self.appErrors = ko.observable(true);
};

function AppViewModel(solvents) {
    var self = this;
    self.solvents = solvents;
    var solvent = { name: "Product", integral: 1, mass: 0, standardnrH: 1 };
    self.selectedSolvents = ko.observableArray([
        new SelectedSolvents(solvent)
    ]);
    self.addSolvent = function () {
        var solvent = new SelectedSolvents(self.solvents[0])
        self.selectedSolvents.push(solvent);
    };
    self.removeSolvent = function (solvent) {
        self.selectedSolvents.remove(solvent);
    };
    self.numberOfErrors = ko.computed(function () {
        var totalrelH = 0;
        $.each(self.selectedSolvents(), function () {
            totalrelH += this.relativeH();
        });
        $.each(self.selectedSolvents(), function () {
            if (totalrelH > 0) {
                this.molPercentage(this.relativeH() / totalrelH);
            }


        });
        $.each(self.selectedSolvents(), function () {
            this.massPercentage(this.molPercentage() * this.mass());
        });
        var totalRelativemass = 0;
        $.each(self.selectedSolvents(), function () {
            totalRelativemass += this.massPercentage();
        });
        $.each(self.selectedSolvents(), function () {
            if (totalRelativemass > 0) {
                this.weightPercentage(this.massPercentage() / totalRelativemass);
            }
        });
        var numberOfErrors = 0;

        $.each(self.selectedSolvents(), function () {
            numberOfErrors += this.errors().length;
            
        });
     
        if (numberOfErrors > 0) {
            $.each(self.selectedSolvents(), function () {
                this.appErrors(false);
            });
        }
        else {
            $.each(self.selectedSolvents(), function () {
                this.appErrors(true);
            });
        }
        return numberOfErrors;
    });
  
    self.addSolvent();
};

var viewModel = new AppViewModel(solventsList);

ko.applyBindings(viewModel);


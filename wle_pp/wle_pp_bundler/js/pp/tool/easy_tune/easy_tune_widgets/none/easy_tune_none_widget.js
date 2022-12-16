
PP.EasyTuneNoneWidget = class EasyTuneNoneWidget extends PP.EasyTuneBaseWidget {

    constructor(params) {
        super(params);

        this._mySetup = new PP.EasyTuneNoneWidgetSetup();
        this._myUI = new PP.EasyTuneNoneWidgetUI();
    }
};
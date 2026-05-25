import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit, OnChanges {

  @Input() objectName : string = "Element" ;   //name of objects class
  @Input() ObjectPropName! : string ; //name of the property visible in list select
  @Input() myList : any = [] ;
  @Input() initObj: any;  //on create select 
  @Input() objCaller!: any; 
  @Input() onChangeCaller!: string; 
  @Input() disbaleit: any;  //on create select 
  @Input() selectId: string;
  selectedObjId: any = null;       //when change selection
  selectedObj: any = null;       //when change selection

  constructor() { }

  ngOnInit(): void {
    this.syncFromInitObj();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initObj'] || changes['myList']) {
      this.syncFromInitObj();
    }
  }

  private syncFromInitObj(): void {
    if (this.ObjectPropName) {
      if (this.initObj && typeof this.initObj === 'object') {
        this.selectedObjId = this.initObj.id ?? null;
        this.selectedObj = this.initObj;
      } else {
        this.selectedObjId = this.initObj ?? null;
        this.selectedObj = this.getObjFromId(this.selectedObjId);
      }
      return;
    }

    this.selectedObjId = this.initObj ?? null;
    this.selectedObj = this.selectedObjId;
  }

  getObjDisplay(obj:any){
    if(this.ObjectPropName) {
      return obj ? obj[this.ObjectPropName] : "";
    }
    else {
      return obj;
    }
  }

  getObjValue(obj:any){
    // console.log("getObjValue deb obj", obj)
    var val = null ;
    if(this.ObjectPropName) {
      val = obj ? obj.id : -1;
    }
    else {
      val = obj;
    }

    // console.log("getObjValue fin val", val)

    return val;

  }

   onChange00(event:any){

    // console.log("onChange00 deb event, ObjectPropName", event, this.ObjectPropName)

    this.selectedObjId=event;
    this.selectedObj = this.ObjectPropName ? null : event;
    if(this.ObjectPropName && this.myList) {
      this.selectedObj = this.getObjFromId(event);
    }

    // console.log("onChange00 fin selectedObjId, selectedObj", this.selectedObjId, this.selectedObj)
  } 

  onChange(event:any){

    // console.log("onChange deb event", event)

    this.onChange00(event)

    // //////////console.log("******* onChange: ", event, this.selectedObj, this.myList);
    this.setObjInCaller(this.selectedObj);
  }

  setObjInCaller(objSel: any){
    // Permettre l'appel même si objSel est null (pour le cas du consultant null)
    if(this.objCaller && this.onChangeCaller) {
      this.objCaller[this.onChangeCaller](objSel);
    }
  }

  getObjFromId(id: number) {
    if(id == null ) return null 
    
    let objSel = this.ObjectPropName ? null : id;
    if(this.ObjectPropName && this.myList) {
      for(let obj of this.myList) {
        if(obj != null && obj.id == id) {objSel = obj; break;}
      }
    }
    // console.log("getObjFromId id", id)
    return objSel;
  }



}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Relation } from '../model/relation';
import { DataSharingService } from './data-sharing.service';
import { UtilsService } from './utils.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class TableService {

  private myUrl: string;

  constructor(private http: HttpClient, private utils: UtilsService, private dataSharingService: DataSharingService) {
    this.myUrl = environment.apiUrl + '/tables/';
  }

  relationsData: Relation[] = [];  // contenu JSON des relations pour D3

  getTables(fOk: Function, fKo: Function) {
    this.http.get<string[]>(this.myUrl).subscribe(
      tables => {
        tables = tables.map(t => t)
        tables = tables.sort((a, b) => a.localeCompare(b));
        console.log("getTables tables : ", tables)
        if (fOk) fOk(tables)
      },
      error => {
        console.log("getTables error : ", error)
        if (fKo) fKo(error)
      }
    );
  }

  deleteTableData(table: string, fOk: Function, fKo: Function) {
    this.http.delete(this.myUrl + table).subscribe(() => {
      // sql = "delete from " + table 
    });
  }

  executeSql(sql, fOk: Function, fKo: Function) {
    let infos = ""
    let sqlResult: any[] = []

    this.http.post<any[]>(this.myUrl + 'execute', sql, {
      headers: { 'Content-Type': 'text/plain' }
    }).subscribe(
      result => {
        sqlResult = result
        if (fOk) fOk(sqlResult)
      }, error => {
        infos = JSON.stringify(error)
        if (fKo) fKo(infos)
      }
    );
  }

  getLinesOfTable(table: string, fOk: Function, fKo: Function) {
    let fct = "getLinesOfTable"

    this.http.get<any[]>(this.myUrl + table).subscribe(
      data => {
        console.log(fct + " table, data : ", table, data)
        if (fOk) fOk(data)
      },
      error => {
        console.log(fct + " error : ", error)
        if (fKo) fKo(error)
      }
    );
  }

  getColsOfTable(table: string, fOk: Function, fKo: Function) {
    let fct = "getColsOfTable"
    console.log(fct + " : table : ", table)
    // let columnMetadata: ColumnDetails[] = [];
    let columnMetadata: any[] = [];
    let mapColType = {}
    let mapColTypeInput = {}

    this.http.get<any[]>(this.myUrl + table + '/columns').subscribe(
      data => {
        console.log(fct + " data : ", data)
        columnMetadata = data;

        columnMetadata = columnMetadata.map(col => ({
          ...col,
          columnName: col.columnName,
          dataType: col.dataType
        }));

        console.log(fct + " columnMetadata : ", columnMetadata)

        if (columnMetadata && columnMetadata.length) {
          for (let ct of columnMetadata) {
            let col = ct.columnName
            let typ = ct.dataType
            mapColType[col] = typ
            mapColTypeInput[col] = this.getTypeInput(col, mapColType)
          }

          if (fOk) fOk(columnMetadata, mapColType, mapColTypeInput)

          console.log(fct + " mapColType : ", mapColType)
          console.log(fct + " mapColTypeInput : ", mapColTypeInput)
        }
      },
      error => {
        console.log(fct + " error : ", error)
        if (fKo) fKo(error)
      }
    );
  }

  getTypeInput(col: string, mapColType: {}) {
    col = (col + "").toUpperCase()
    let typ = (mapColType[col] + "").toUpperCase()
    let res = "text"
    if (typ.includes("DATE")) {
      res = "date"
    } else if (typ.includes("TIMESTAMP")) {
      res = "datetime-local"
    } else if (typ.includes("INT") || typ.includes("NUMBER") || typ.includes("DECIMAL")) {
      res = "number"
    } else if (typ.includes("BOOL")) {
      res = "checkbox"
    }
    return res
  }

  openRelations(fOk: Function, fKo: Function) {
    // Charger les relations du backend
    this.http
      .get<any[]>(this.myUrl + "relations")
      .subscribe({
        next: (res) => {
          console.log("openRelations : res : ", res)
          this.relationsData = res;
          // 🔥 map pour corriger les noms de colonnes
          if (res && res.length) {
            this.relationsData = res.map(r => ({
              table: r.TABLE_NAME,
              column: r.COLUMN_NAME,
              target_table: r.TARGET_TABLE,
              target_pk: r.TARGET_PK
            }));
          }
          console.log("openRelations : relationsData : ", this.relationsData)

          if (fOk) fOk(this.relationsData)
        },
        error: (err) => {
          console.log("openRelations : err : ", err)
          console.error(err);
          if (fKo) fKo(err)
        },
      });
  }

  exportAllTablesToJson(arg0: (res: any) => void, arg1: (err: any) => void) {
    this.http.get<any>(this.myUrl + "exportAllToJson").subscribe(
      res => {
        console.log("exportAllTablesToJson : res : ", res)
        if (arg0) arg0(res)
      },
      err => {
        console.log("exportAllTablesToJson : err : ", err)
        if (arg1) arg1(err)
      }
    );
  }

  importFromJsonToTable(selectedTable: string, jsonData: any[], fctOk: Function, fctKo: Function) {
    this.http.post(this.myUrl + "importFromJson/" + selectedTable, jsonData).subscribe(
      res => {
        console.log("importFromJsonToTable : res : ", res)
        if (fctOk) fctOk(res)
      },
      err => {
        console.log("importFromJsonToTable : err : ", err)
        if (fctKo) fctKo(err)
      }
    );
  }

  //////////////////

}

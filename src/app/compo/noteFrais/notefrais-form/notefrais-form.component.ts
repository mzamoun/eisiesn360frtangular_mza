


import { Component, Input, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { parse } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FileService } from 'src/app/service/FileService';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import * as Tesseract from 'tesseract.js';
import { createWorker } from 'tesseract.js';
import { Activity } from '../../../model/activity';
import { Category } from '../../../model/category';
import { Consultant } from '../../../model/consultant';
import { NoteFrais } from '../../../model/noteFrais';
import { PayementMode } from '../../../model/payementMode';
import { ActivityService } from '../../../service/activity.service';
import { CategoryService } from '../../../service/category.service';
import { DataSharingService } from '../../../service/data-sharing.service';
import { NoteFraisService } from '../../../service/note-frais.service';
import { PayementModeService } from '../../../service/payement-mode.service';
import { UtilsService } from '../../../service/utils.service';
import { SelectComponent } from '../../_reuse/select-consultant/select/select.component';
import { MereComponent } from '../../_utils/mere-component';

@Component({
  selector: 'app-notefrais-form',
  templateUrl: './notefrais-form.component.html',
  styleUrls: ['./notefrais-form.component.css']
})


export class NotefraisFormComponent extends MereComponent {

  titre = 'Note Frais Form';
  btnSaveTitle = 'Add';
  isAdd: string;
  add = false;

  @Input()
  myObj: NoteFrais;
  categories: Category[];
  payementsModes: PayementMode[];
  activities: Activity[];
  selectedFile: string | ArrayBuffer;

   @Input()
  consultantSelected: Consultant = this.userConnected
  load: boolean;
  isLoading = false;

  // tslint:disable-next-line:max-line-length
  constructor(private route: ActivatedRoute, private router: Router
    , private noteFraisService: NoteFraisService
    , private activityService: ActivityService
    , private categoryService: CategoryService
    , private payementModeService: PayementModeService
    , private fileService: FileService
    , public utils: UtilsService
    , private utilsIhm: UtilsIhmService
    , public dataSharingService: DataSharingService) {
    super(utils, dataSharingService);

    // this.userConnected = dataSharingService.userConnected

  }

  ngOnInit() {
    super.ngOnInit()

    this.initByNoteFrais();
    this.getCategories();
    this.getPayementModes();
    this.getActivities();
  }

  initByNoteFrais() {
    // ////this.logger.debug('initByNoteFrais')
    if (this.isAdd == null) {
      this.isAdd = this.route.snapshot.queryParamMap.get('isAdd');
    }
    // tslint:disable-next-line:triple-equals
    if (this.isAdd == 'true') {
      let consultantStr = this.route.snapshot.queryParamMap.get('consultantSelected');
      if(consultantStr) {
        this.consultantSelected = JSON.parse(consultantStr);
      }
      this.btnSaveTitle = this.utils.tr("Add");
      this.titre = this.utils.tr("NewFee");
      this.myObj = new NoteFrais();
    } else {
      this.btnSaveTitle = this.utils.tr("Save");
      this.titre = this.utils.tr("Edit") + " " + this.utils.tr("Frais");
      const noteFraisP: NoteFrais = this.noteFraisService.getNoteFrais();
      // ////this.logger.debug('clientP='+clientP);

      if (noteFraisP != null) { this.myObj = noteFraisP; } else if (this.myObj == null) { this.myObj = new NoteFrais(); }
    }
  }

  onSubmit() {
    this.isLoading = true
    this.logger.debug("*** onSubmit : ", this.myObj);
    this.myObj.consultant = this.consultantSelected;
    if(this.myObj.activity) this.myObj.activity.consultant = this.consultantSelected;
    this.myObj.state = 'Waiting';
    this.beforeCallServer("onSubmit");
    this.noteFraisService.save(this.myObj).subscribe(
      data => {
        this.isLoading = false
        this.afterCallServer("onSubmit", data)
        if (!this.isError()) { this.gotoNoteFraisList(); }
      },
      error => {
        this.isLoading = false
        this.addErrorFromErrorOfServer("onSubmit", error);
      }
    );
  }


  gotoNoteFraisList() {
    this.clearInfos();
    this.router.navigate(['/notefrais_list']);

    this.router.navigate(['/notefrais_list'], {
      queryParams: {
        consultantSelected: JSON.stringify(this.consultantSelected)
      }
    });
  }

  onSelectCategory(category: Category) {
    this.myObj.category = category;
  }

  @ViewChild('compoSelectCategory', { static: false }) compoSelectCategory: SelectComponent;
  selectCategory(category: Category) {
    this.compoSelectCategory.selectedObj = category;
  }

  onSelectPayementMode(payementMode: PayementMode) {
    this.myObj.payementMode = payementMode;
  }

  @ViewChild('compoSelectPayementMode', { static: false }) compoSelectPayementMode: SelectComponent;
  selectPayementMode(payementMode: PayementMode) {
    this.compoSelectPayementMode.selectedObj = payementMode;
  }

  onSelectActivity(activity: Activity) {
    this.myObj.activity = activity;
  }

  @ViewChild('compoSelectActivity', { static: false }) compoSelectActivity: SelectComponent;
  selectActivity(activity: Activity) {
    this.compoSelectActivity.selectedObj = activity;
  }

  getCategories() {
    this.isLoading = true
    this.beforeCallServer("getCategories");
    this.categoryService.findAll().subscribe(
      data => {
        this.isLoading = false
        this.afterCallServer("getCategories", data)
        this.categories = data.body.result;
        if (data == undefined) {
          this.categories = new Array();
        }

        if (this.isAdd != 'true') {
          this.selectCategory(this.myObj.category);
        }

        // Si le texte du ticket a ete extrait avant le chargement des categories,
        // tenter l auto-categorisation des que la liste est disponible.
        if (!this.myObj?.category && this.myObj?.textFilePdf) {
          this.majChamp_Category(this.myObj.textFilePdf.split('\n'));
        }
      }, error => {
        this.isLoading = false
        this.addErrorFromErrorOfServer("getCategories", error);
      }
    );
  }

  getCategorieIndexById(categoryId: number): number {
    const res = -1;
    // ////this.logger.debug(this.categories);
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].id == categoryId) {
        return i;
      }
    }
    return res;
  }

  getPayementModes() {
    this.isLoading = true
    this.beforeCallServer("getPayementModes");
    this.payementModeService.findAll().subscribe(
      data => {
        this.isLoading = false
        this.afterCallServer("getPayementModes", data)
        this.payementsModes = data.body.result;
        if (data == undefined) {
          this.payementsModes = new Array();
        }

        if (this.isAdd != 'true') {
          this.selectPayementMode(this.myObj.payementMode);
        }
      }, error => {
        this.isLoading = false
        this.addErrorFromErrorOfServer("getPayementModes", error);
      }
    );
  }

  getPayementModeIndexById(payementModeId: number): number {
    const res = -1;
    // ////this.logger.debug(this.payementsModes);
    for (let i = 0; i < this.payementsModes.length; i++) {
      if (this.payementsModes[i].id == payementModeId) {
        return i;
      }
    }
    return res;
  }

  getActivities() {
    this.isLoading = true
    this.beforeCallServer("getActivities");
    this.activityService.findAllByConsultant(this.consultantSelected.id).subscribe(
      data => {
        this.isLoading = false
        this.afterCallServer("getActivities", data)
        this.activities = data.body.result;
        if (data == undefined) {
          this.activities = new Array();
        }

        if (this.isAdd != 'true') {
          this.selectActivity(this.myObj.activity);
        }
      }, error => {
        this.isLoading = false
        this.addErrorFromErrorOfServer("getActivities", error);
      }
    );
  }

  getActivityIndexById(activityId: number): number {
    const res = -1;
    // ////this.logger.debug(this.categories);
    for (let i = 0; i < this.activities.length; i++) {
      if (this.activities[i].id == activityId) {
        return i;
      }
    }
    return res;
  }

  calculAmounts() {
    // if(this.myObj.amount == null || this.myObj.amount == 0) {
    // }

    let ht = this.myObj.pretax_amount
    let tva = this.myObj.vat
    let ttc = this.myObj.amount
    if (!ht) ht = 0
    if (!tva) tva = 0
    if (!ttc) ttc = 0

    if (ht > 0 && tva > 0) {
      this.myObj.amount = this.utils.round(ht + tva)
    } else if (tva > 0 && ttc > 0) {
      this.myObj.pretax_amount = this.utils.round(ttc - tva)
    } else if (ht > 0 && ttc > 0) {
      this.myObj.vat = this.utils.round(ttc - ht)
    }

  }

  onFileSelect01(event) {
    this.myObj = new NoteFrais();

    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      this.setContentFile(file)
      this.isLoading = true
      this.fileService.uploadFile(file).subscribe(
        data => {
          this.isLoading = false
          this.myObj.textFilePdf = data.body.result
          this.majChamps();
        }, error => {
          this.isLoading = false
          this.logger.debug("onFileSelect : error ", error)
        }
      )

    }
  }

  onFileSelect(event: any) {
    this.myObj = new NoteFrais();
    const file: File = event.target.files[0];
    this.logger.debug("file : ", file)

    if (!file) {
      return
    }

    this.setContentFile(file)

    if (file.type.startsWith("image")) {
      this.logger.debug("+++image")
      const reader = new FileReader();
      reader.readAsDataURL(file);
      this.isLoading = true
      reader.onload = () => {
        const imageDataUrl = reader.result as string;
        Tesseract.recognize(
          imageDataUrl,
          'fra' // Langue : 'eng' pour anglais, 'fra' pour français
        ).then(({ data: { text } }) => {
          this.isLoading = false
          this.myObj.textFilePdf = text;
          this.majChamps();
        }).catch(err => {
          this.isLoading = false
          this.logger.error('Erreur OCR:', err)
        }
        );
      };
    } else {
      this.logger.debug("+++pdf")
      this.isLoading = true
      this.fileService.uploadFile(file).subscribe(
        data => {
          this.isLoading = false
          this.myObj.textFilePdf = data.body.result
          this.majChamps();
        }, error => {
          this.isLoading = false
          this.logger.debug("onFileSelect : error ", error)
        }
      )
    }

  }

  getFirstLineNonVide(lines: string[]) {
    for (let line of lines) {
      if (line) return line
    }
    return ""
  }

  majChamps() {
    let text = this.myObj.textFilePdf
    this.myObj.description = text
    this.myObj.country = "France"

    const lines = text.split('\n');
    let line0 = this.getFirstLineNonVide(lines)
    this.logger.debug("majChamps : line0 : ", line0)
    this.myObj.title = line0

    if (line0.includes("mobile.free.fr")) {
      this.logger.debug("majChamps : cas free mobile")
      this.majChampsFreeMobile(lines)
    } else if (line0) {
      this.logger.debug("majChamps : cas line0 non vide : ", line0)
      this.majChampsAutre(lines)
    } else {
      this.logger.debug("majChamps : fichier vide !")
    }

    this.calculAmounts()
  }

  majChampsAutre(lines: string[]) {
    this.majChamp_Date(lines)
    this.majChamp_NumFacture(lines)
    this.majChamp_HT(lines)
    this.majChamp_TVA(lines)
    this.majChamp_TTC(lines)
    this.majChamp_Enseigne(lines)
    this.majChamp_Category(lines)
  }

  private normalizeText(value: string): string {
    if (!value) {
      return '';
    }
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  private findCategoryByHints(hints: string[]): Category | null {
    if (!this.categories?.length || !hints?.length) {
      return null;
    }

    const normalizedHints = hints.map(h => this.normalizeText(h)).filter(Boolean);
    if (!normalizedHints.length) {
      return null;
    }

    for (const category of this.categories) {
      const normalizedCategoryName = this.normalizeText(category?.name || '');
      if (!normalizedCategoryName) {
        continue;
      }
      if (normalizedHints.some(h => normalizedCategoryName.includes(h) || h.includes(normalizedCategoryName))) {
        return category;
      }
    }
    return null;
  }

  majChamp_Category(lines: string[]) {
    if (!this.categories?.length || this.myObj?.category?.id) {
      return;
    }

    const sourceText = this.normalizeText((lines || []).join(' ') + ' ' + (this.myObj?.title || ''));
    if (!sourceText) {
      return;
    }

    // 1) Priorite au match direct sur le nom de categorie configure en base.
    for (const category of this.categories) {
      const normalizedCategoryName = this.normalizeText(category?.name || '');
      if (!normalizedCategoryName) {
        continue;
      }
      if (sourceText.includes(normalizedCategoryName)) {
        this.myObj.category = category;
        this.myObj.categoryId = category.id;
        this.selectCategory(category);
        return;
      }
    }

    // 2) Fallback par mots-cles metier courants.
    const keywordRules: Array<{ keywords: string[]; hints: string[] }> = [
      { keywords: ['hotel', 'hebergement', 'booking', 'airbnb'], hints: ['hotel', 'hebergement', 'logement'] },
      { keywords: ['restaurant', 'restauration', 'repas', 'dejeuner', 'diner'], hints: ['restauration', 'repas'] },
      { keywords: ['train', 'sncf', 'metro', 'bus', 'tram', 'taxi', 'uber', 'transport', 'deplacement'], hints: ['transport', 'deplacement', 'mobilite'] },
      { keywords: ['avion', 'air france', 'vol'], hints: ['transport', 'voyage', 'avion'] },
      { keywords: ['carburant', 'essence', 'diesel', 'station', 'totalenergies', 'shell'], hints: ['carburant', 'essence'] },
      { keywords: ['peage', 'autoroute'], hints: ['peage', 'transport'] },
      { keywords: ['parking', 'stationnement'], hints: ['parking', 'transport'] },
      { keywords: ['telephone', 'mobile', 'telecom', 'orange', 'sfr', 'bouygues', 'free'], hints: ['telephone', 'telecom', 'communication'] },
      { keywords: ['fourniture', 'papeterie', 'materiel'], hints: ['fourniture', 'materiel', 'bureau'] }
    ];

    for (const rule of keywordRules) {
      const hasKeyword = rule.keywords.some(k => sourceText.includes(this.normalizeText(k)));
      if (!hasKeyword) {
        continue;
      }
      const inferredCategory = this.findCategoryByHints(rule.hints);
      if (inferredCategory) {
        this.myObj.category = inferredCategory;
        this.myObj.categoryId = inferredCategory.id;
        this.selectCategory(inferredCategory);
        return;
      }
    }
  }

  majChamp_HT(lines: string[]) {
  }
  majChamp_TVA(lines: string[]) {
  }
  majChamp_TTC(lines: string[]) {

    const regex = new RegExp("\\bTTC\\b.*?(\\d+[.,]?\\d*)", "gi");

    for (let line of lines) {

      this.logger.debug("*** ttc : this.myObj.amount 1 : ", this.myObj.amount)

      if (!this.myObj.amount) {

        let match;
        let maxTTC: number | null = null;

        while ((match = regex.exec(line)) !== null) {
          let value = parseFloat(match[1].replace(",", ".")); // Convertir , en . pour les décimaux
          if (maxTTC === null || value > maxTTC) {
            maxTTC = value;
          }
        }
        this.myObj.amount = maxTTC
      } else {
        break;
      }
    }

    this.logger.debug("*** ttc : this.myObj.amount 2 : ", this.myObj.amount)
    if (!this.myObj.amount || !this.myObj.pretax_amount) {
      // apres une ligne contenant tva HT TTC (ignore case et dans le desordre), si on trouve une ligne contenant au moins 3 nombres, alors tva = min, ttc = max, ht=ttc-tva
      const regexNumbers = /(?<![\d\w%])\d+[\.,]?\d*(?![\w%])/g;
      for (let i = 0; i < lines.length - 1; i++) {
        let line = lines[i]
        let linei = line.toLowerCase()
        this.logger.debug("*** ttc : linei : ", linei)
        if (linei.includes("ttc") || linei.includes("total")) {
          this.logger.debug("*** ttc : on a une line ttc : ", line)
          let numbers = []
          numbers = (line.match(regexNumbers) || []).map(num => parseFloat(num.replace(",", ".")));
          if (!numbers || numbers.length < 3) {
            numbers = (lines[i + 1].match(regexNumbers) || []).map(num => parseFloat(num.replace(",", ".")));
          }

          this.logger.debug("*** ttc : numbers : ", numbers)

          if (numbers.length >= 3) {
            this.logger.debug("*** ttc : 3 numbers : ")
            const tva = Math.min(...numbers);
            const ttc = Math.max(...numbers);
            const ht = ttc - tva;

            this.myObj.amount = ttc
            this.myObj.pretax_amount = ht
            this.myObj.vat = tva
            break;
          }
        } else if (linei.includes("montant") && !this.myObj.amount) {
          this.logger.debug("*** ttc : montant linei : ", linei)
          let numbers = []
          numbers = (line.match(regexNumbers) || []).map(num => parseFloat(num.replace(",", ".")));
          this.logger.debug("*** ttc : montant numbers : ", numbers)
          if (numbers.length == 1) {
            this.myObj.amount = numbers[0]
            this.logger.debug("*** ttc : montant this.myObj.amount : ", this.myObj.amount)
          }
        } else if (linei.includes(" cb ") && !this.myObj.amount) {
          this.logger.debug("*** ttc : cb linei : ", linei)
          let numbers = []
          numbers = (line.match(regexNumbers) || []).map(num => parseFloat(num.replace(",", ".")));
          this.logger.debug("*** ttc : cb numbers : ", numbers)
          if (numbers.length == 1) {
            this.myObj.amount = numbers[0]
            this.logger.debug("*** ttc : cb this.myObj.amount : ", this.myObj.amount)
          }
        } else if (linei.includes("pay") && !this.myObj.amount) {
          this.logger.debug("*** ttc : pay linei : ", linei)
          let numbers = []
          numbers = (line.match(regexNumbers) || []).map(num => parseFloat(num.replace(",", ".")));
          this.logger.debug("*** ttc : pay numbers : ", numbers)
          if (numbers.length == 1) {
            this.myObj.amount = numbers[0]
            this.logger.debug("*** ttc : pay this.myObj.amount : ", this.myObj.amount)
          }
        }
      }
    }
  }
  majChamp_Enseigne(lines: string[]) {
    if (!this.myObj.brand_name) this.myObj.brand_name = this.myObj.title
  }

  majChamp_NumFacture(lines: string[]) {

    const regex = /(?:i)\bFacture\b\s*(?:n°|n|num|numéro|numero)\s*(\d+)/;

    lines.forEach(line => {
      const match = line.match(regex);
      if (match && !this.myObj.invoice_number) {
        this.logger.debug(`Numéro de facture trouvé : ${match[1]}`);
        this.myObj.invoice_number = match[1]
      }
    });
  }

  majChamp_Date(lines: string[]) {
    const regexs = [
      /\b\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}\b/, // 03-02-2025 14:32:05
      /\b\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}\b/, // 03/02/2025 14:32
      /\b\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}\b/, // 03/02/2025 14:32:05
      /\b\d{2}-\d{2}-\d{2} À \d{2}-\d{2}-\d{2}\b/, // 16-01-25 À 19-42-27
      /\b\d{2}\/\d{2}\/\d{2} \d{2}:\d{2}\b/, // 16/01/25 18:33
      /\b([Ll]undi|[Mm]ardi|[Mm]ercredi|[Jj]eudi|[Vv]endredi|[Ss]amedi|[Dd]imanche) (\d{1,2}) ([Jj]anvier|[Ff]évrier|[Mm]ars|[Aa]vril|[Mm]ai|[Jj]uin|[Jj]uillet|[Aa]oût|[Ss]eptembre|[Oo]ctobre|[Nn]ovembre|[Dd]écembre) (\d{4})\b/, // Mardi 14 Janvier 2025
      /\b([Ll]undi|[Mm]ardi|[Mm]ercredi|[Jj]eudi|[Vv]endredi|[Ss]amedi|[Dd]imanche) (\d{1,2}) ([Jj]anvier|[Ff]évrier|[Mm]ars|[Aa]vril|[Mm]ai|[Jj]uin|[Jj]uillet|[Aa]oût|[Ss]eptembre|[Oo]ctobre|[Nn]ovembre|[Dd]écembre) (\d{4}) \d{2}:\d{2}:\d{2}\b/ // Mardi 14 Janvier 2025 14:32:05
    ];

    const formats = [
      "dd-MM-yyyy HH:mm:ss",
      "dd/MM/yyyy HH:mm",
      "dd/MM/yyyy HH:mm:ss",
      "dd-MM-yy 'À' HH-mm-ss",
      "dd/MM/yy HH:mm",
      "EEEE d MMMM yyyy", // Jour de la semaine + Date
      "EEEE d MMMM yyyy HH:mm:ss" // Jour de la semaine + Date + Heure
    ];

    for (const line of lines) {
      for (let j = 0; j < regexs.length; j++) {
        const match = line.match(regexs[j]);
        if (match) {
          try {
            this.myObj.dateNf = parse(match[0], formats[j], new Date(), { locale: fr });
            this.logger.debug("Date trouvée :", this.myObj.dateNf);
          } catch (error) {
            this.logger.error("Erreur de parsing pour :", match[0], error);
          }
          break; // On arrête la boucle dès qu'on trouve un match
        }
      }
    }
  }

  majChampsFreeMobile(lines: string[]) {

    let i = 0
    for (let line of lines) {
      if (line.includes(" au capital de ") && !this.myObj.brand_name) {
        this.myObj.brand_name = line.split("–")[0]
      } else if (line.includes("Facture n") && !this.myObj.invoice_number) {
        let tab = line.split(" ")
        let txt = tab[3]
        this.myObj.invoice_number = txt
        this.myObj.dateNf = this.utils.convertToDate(tab[5] + " " + tab[6] + " " + tab[7])
      } else if (line.includes("facture HT") && !this.myObj.pretax_amount) {
        let tab = line.split(" ")
        let txt = tab[5].toLowerCase().replace("e", "").replace("€", "")
        this.myObj.pretax_amount = Number.parseFloat(txt)
      } else if (line.includes("TVA ") && !this.myObj.vat) {
        let tab = line.split(" ")
        let txt = tab[2].toLowerCase().replace("e", "").replace("€", "")
        this.myObj.vat = Number.parseFloat(txt)
      }
      i++
    }

  }

  setContentFile(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.myObj.invoice_file = reader.result;
    };
  }

  //////////////////////////////////////////////////

  onFileSelect00(event) {
    if (event.target.files.length > 0) {
      this.logger.debug("onFileSelect 1")
      this.extractDataPdf(event);
      this.logger.debug("onFileSelect 2")
      const file: File = event.target.files[0];
      const ext = file.name.substr(file.name.lastIndexOf('.') + 1);
      this.logger.debug("onFileSelect 3")
      const x = true;
      if (x) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        this.logger.debug("onFileSelect 4")
        reader.onload = () => {
          this.myObj.invoice_file = reader.result;
          this.logger.debug("onFileSelect 5")
        };
      } else {
        // alert('Oops, Format de fichier erroné, seulement fichier Pdf/png/jpg.');
        this.utilsIhm.info(this.utils.tr('app.common.error.invalidFileFormatPdfPngJpg'), null, null);
        // this.selectedFile.nativeElement.value="";
      }
    }
  }

  async extractDataPdf(file: any) {
    this.logger.debug("extractDataPdf 1 file: ", file)
    this.load = true;
    let res = file.target.files[0].name;
    const worker = createWorker({
      logger: m => this.logger.debug(m),
    });
    await worker.load();
    this.logger.debug("extractDataPdf 2  ")
    await worker.loadLanguage('eng', 'fr');
    this.logger.debug("extractDataPdf 3  ")
    await worker.initialize('eng');
    this.logger.debug("extractDataPdf 4 file.target.files[0] : ", file.target.files[0])
    const { data: { text } } = await worker.recognize(file.target.files[0]);
    this.logger.debug("extractDataPdf 5  ")
    const regexExp = /(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})/gi;
    const caracSpec = /[€$£!@#$%^&*()_+\-=\[\]{};:\\|,.<>\/?]/;

    //Extraire le nom d'enseigne du facture
    const lignes = text.split('\n');
    for (let ligne of lignes) {
      if (!caracSpec.test(ligne) && ligne.length > 3 && ligne.split(' ').length - 1 < 3) {
        this.myObj.brand_name = ligne;
        break;
      }
    }

    this.logger.debug("extractDataPdf 6  ")

    let montantFinded = false;
    let montantHTFinded = false;
    let tvaFinded = false;

    //Parcourir la facture ligne par ligne
    //Extraction du DATE / MONTANT / MONTANT HT / TVA
    for (let ligne of lignes) {
      let champs = ligne.split(' ');
      //this.logger.debug(champs);
      let pos = 0;
      for (let champ of champs) {
        pos++;

        //Detection et organisation du date 
        if (regexExp.test(champ)) {
          if (champ.indexOf('-') != -1) {
            var date = new Date(champ.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
            this.myObj.dateNf = date;
            //this.logger.debug(champ, date);
          }
          else if (champ.indexOf('/') != -1) {
            var splitedDate = champ.split('/');
            if (Number(splitedDate[0]) > 12) {
              this.myObj.dateNf = new Date(splitedDate[1] + '/' + splitedDate[0] + '/' + splitedDate[2]);
            }
            else {
              this.myObj.dateNf = new Date(champ)
            }
          }
        }

        //Detection du montant
        if ((champ.toUpperCase().indexOf("MONTANT") != -1 || champ.toUpperCase().indexOf("TOTAL") != -1 || champ.toUpperCase().indexOf("TTC") != -1 ||
          champ.toUpperCase().indexOf("NET") != -1 || champ.toUpperCase().indexOf("NETAPAYER") != -1 || champ.toUpperCase().indexOf("PAYER") != -1 ||
          champ.toUpperCase().indexOf("TOTALTTC") != -1) && champ.toUpperCase().indexOf("SUBTOTAL") == -1 && !montantFinded) {
          for (let i = pos; i < champs.length; i++) {
            //le champ ne contient ni espace ni champs vide
            if (champs[i] != "" && champs[i] != " " && !montantFinded) {
              //this.logger.debug("le mot Montant detecté", champs[i]);
              let montant = "";
              if (champs[i].indexOf('£') != -1) {
                montant = champs[i].replace('£', '');
              }
              else if (champs[i].indexOf('$') != -1) {
                montant = champs[i].replace('$', '');
              }
              else if (champs[i].indexOf('€') != -1) {
                montant = champs[i].replace('€', '');
              }
              else if (champs[i].indexOf(',') == champs[i].length - 1) {
                montant = champs[i].replace(',', '');
              }
              else if (champs[i].indexOf(' ') == champs[i].length - 1) {
                montant = champs[i].replace(' ', '');
              }
              else if (champs[i].indexOf('*') != -1) {
                montant = champs[i].replace('*', '');
              }
              else if (champs[i].indexOf('#') != -1) {
                montant = champs[i].replace('#', '');
              }
              else if (champs[i].indexOf('¢') != -1) {
                montant = champs[i].replace('¢', '');
              }
              else if (champs[i].indexOf(',') != -1) {
                montant = champs[i].replace(',', '.');
              }
              else {
                montant = champs[i];
              }
              if (!isNaN(Number(montant)) && montant != "") {
                //this.logger.debug(Number(montant));
                this.myObj.amount = Number(montant);
                montantFinded = true;
              }
            }
          }
        }

        //Detection du PRIX HORS TAXE
        if ((champ.toUpperCase().indexOf("HT") != -1 || champ.toUpperCase().indexOf("H.T") != -1 || champ.toUpperCase().indexOf("HORS") != -1 ||
          champ.toUpperCase().indexOf("HY") != -1 || champ.toUpperCase().indexOf("SUBTOTAL") != -1) && !montantHTFinded) {
          for (let i = pos; i < champs.length; i++) {
            //le champ ne contient ni espace ni champs vide
            if (champs[i] != "" && champs[i] != " " && !montantHTFinded) {
              //this.logger.debug("le mot Montant HT detecté", champs[i]);
              let montantHT = "";
              if (champs[i].indexOf('£') != -1) {
                montantHT = champs[i].replace('£', '');
              }
              else if (champs[i].indexOf('$') != -1) {
                montantHT = champs[i].replace('$', '');
              }
              else if (champs[i].indexOf('€') != -1) {
                montantHT = champs[i].replace('€', '');
              }
              else if (champs[i].indexOf(',') == champs[i].length - 1) {
                montantHT = champs[i].replace(',', '');
              }
              else if (champs[i].indexOf(' ') == champs[i].length - 1) {
                montantHT = champs[i].replace(' ', '');
              }
              else if (champs[i].indexOf('*') != -1) {
                montantHT = champs[i].replace('*', '');
              }
              else if (champs[i].indexOf('#') != -1) {
                montantHT = champs[i].replace('#', '');
              }
              else if (champs[i].indexOf('¢') != -1) {
                montantHT = champs[i].replace('¢', '');
              }
              else if (champs[i].indexOf(',') != -1) {
                montantHT = champs[i].replace(',', '.');
              }
              else {
                montantHT = champs[i];
              }
              if (!isNaN(Number(montantHT)) && montantHT != "") {
                //this.logger.debug(Number(montantHT));
                this.myObj.pretax_amount = Number(montantHT);
                montantHTFinded = true;
              }
            }
          }
        }

        //Detection du TVA
        if ((champ.toUpperCase().indexOf("TVA") != -1 || champ.toUpperCase().indexOf("TAX") != -1) && !tvaFinded) {
          for (let i = pos; i < champs.length; i++) {
            //le champ ne contient ni espace ni champs vide
            if (champs[i] != "" && champs[i] != " " && !tvaFinded) {
              //this.logger.debug("TVA detecté", champs[i]);
              let tva = "";
              if (champs[i].indexOf('£') != -1) {
                tva = champs[i].replace('£', '');
              }
              else if (champs[i].indexOf('$') != -1) {
                tva = champs[i].replace('$', '');
              }
              else if (champs[i].indexOf('€') != -1) {
                tva = champs[i].replace('€', '');
              }
              else if (champs[i].indexOf(',') == champs[i].length - 1) {
                tva = champs[i].replace(',', '');
              }
              else if (champs[i].indexOf(' ') == champs[i].length - 1) {
                tva = champs[i].replace(' ', '');
              }
              else if (champs[i].indexOf('*') != -1) {
                tva = champs[i].replace('*', '');
              }
              else if (champs[i].indexOf('#') != -1) {
                tva = champs[i].replace('#', '');
              }
              else if (champs[i].indexOf('¢') != -1) {
                tva = champs[i].replace('¢', '');
              }
              else if (champs[i].indexOf(',') != -1) {
                tva = champs[i].replace(',', '.');
              }
              else {
                tva = champs[i];
              }
              if (!isNaN(Number(tva)) && tva != "" && Number(tva) <= 50) {
                //this.logger.debug(Number(tva));
                this.myObj.vat = Number(tva);
                tvaFinded = true;
              }
            }
          }
        }

      }
    }
    //this.logger.debug(this.myObj);
    this.load = false;
    await worker.terminate();
  }

}

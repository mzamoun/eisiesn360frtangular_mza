/**
 * Copyright (C) 2020-@year@ by Eisi Cnsulting.
 * All rights reserved.
 *
 * Eisi Headquarters:
 * 6 RUE DES DEUX COMMUNES
 * 91480 QUINCY SOUS SENART

 * Created at 12/05/2020 02:22
 * @author Saber Ben Khalifa <saber.khalifa@eisi-consulting.fr>
 **/

import { Esn } from "./esn";

export class CraConfiguration {
  id: number;
  esn : Esn
  month: Date;
  monthStringFormat: string;
  holidays: Date[];
  createdDate: Date;
  lastModifiedDate: Date
}

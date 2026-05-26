


import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Constants } from 'src/app/model/constants/constants';
import { Consultant } from 'src/app/model/consultant';
import { ConsultantService } from 'src/app/service/consultant.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { MereComponent } from '../../_utils/mere-component';
import { EsnArboComponent } from '../../esn/esn-arbo/esn-arbo.component';

interface ConsultantMoveOperation {
  consultantId: number;
  fromParentId: number;
  toParentId: number;
  fromIndex: number;
}

interface ConsultantDragDropState {
  rootConsultant: Consultant;
  draggedConsultantId: number;
  dragOverConsultantId: number;
  pendingOperations: ConsultantMoveOperation[];
  saving: boolean;
}

@Component({
  selector: 'app-consultant-arbo',
  templateUrl: './consultant-arbo.component.html',
  styleUrls: ['./consultant-arbo.component.css']
})
export class ConsultantArboComponent extends MereComponent {

  @Input()
  consultant: Consultant;

  @Input()
  manager: Consultant;

  @Input()
  esnArbo: EsnArboComponent;

  @Input()
  dragDropState: ConsultantDragDropState;

  @Output()
  consultantSelected = new EventEmitter<Consultant>();

  constructor(private consultantService: ConsultantService
    , public utils: UtilsService, protected utilsIhm: UtilsIhmService
    , public dataSharingService: DataSharingService) {
    super(utils, dataSharingService);

  }

  ngOnInit(): void {
    if (!this.dragDropState) {
      this.dragDropState = {
        rootConsultant: this.consultant,
        draggedConsultantId: null,
        dragOverConsultantId: null,
        pendingOperations: [],
        saving: false,
      };
    } else if (!this.dragDropState.rootConsultant) {
      this.dragDropState.rootConsultant = this.consultant;
    }

    if (this.consultant) {
      this.getListConsultants(this.consultant, true);
    }
  }

  selectConsultant(consultant: Consultant) {
    this.consultantSelected.emit(consultant);
  }

  getLabel(consultant: Consultant): string {
    if (!consultant) {
      return '';
    }

    const fullName = consultant.fullName || [consultant.firstName, consultant.lastName].filter(part => !!part).join(' ');
    const username = consultant.username ? `@${consultant.username}` : '';
    return `${fullName || username || this.utils.tr('User')} ${username && fullName ? username : ''}`.trim();
  }

  getPhotoUrl(consultant: Consultant): string | null {
    const photo = (consultant?.photo || '').trim();
    if (!photo) {
      return null;
    }

    if (photo.startsWith('data:image')) {
      return photo;
    }

    if (photo.startsWith('iVBOR')) {
      return 'data:image/png;base64,' + photo;
    }

    if (photo.startsWith('/9j/')) {
      return 'data:image/jpeg;base64,' + photo;
    }

    if (photo.startsWith('R0lGOD')) {
      return 'data:image/gif;base64,' + photo;
    }

    if (photo.startsWith('UklGR')) {
      return 'data:image/webp;base64,' + photo;
    }

    return 'data:image/jpeg;base64,' + photo;
  }

  getInitial(consultant: Consultant): string {
    const seed = consultant?.fullName || consultant?.username || '?';
    return seed.trim().charAt(0).toUpperCase() || '?';
  }

  hasChildren(consultant: Consultant): boolean {
    return !!consultant?.listConsultant?.length;
  }

  isRootComponent(): boolean {
    return !this.manager;
  }

  canUseDragDrop(): boolean {
    const role = this.userConnected?.role;
    return role === 'ADMIN' || role === Constants.RESPONSIBLE_ESN;
  }

  canShowActionBar(): boolean {
    return this.isRootComponent() && !this.esnArbo && this.canUseDragDrop();
  }

  hasPendingChanges(): boolean {
    return !!this.dragDropState?.pendingOperations?.length;
  }

  isDraggable(consultant: Consultant): boolean {
    if (!this.canUseDragDrop() || !consultant?.id) {
      return false;
    }

    const rootId = this.dragDropState?.rootConsultant?.id;
    if (rootId && consultant.id === rootId) {
      return false;
    }

    return consultant.role !== 'ADMIN';
  }

  isDropTarget(consultant: Consultant): boolean {
    if (!this.canUseDragDrop() || !consultant) {
      return false;
    }
    return consultant.role === Constants.MANAGER || consultant.role === Constants.RESPONSIBLE_ESN;
  }

  isDragOver(consultant: Consultant): boolean {
    return !!consultant?.id && this.dragDropState?.dragOverConsultantId === consultant.id;
  }

  onDragStart(event: DragEvent, consultant: Consultant): void {
    if (!event?.dataTransfer || !this.isDraggable(consultant)) {
      return;
    }

    const payload = consultant.id + '';
    event.dataTransfer.setData('text/plain', payload);
    event.dataTransfer.effectAllowed = 'move';
    this.dragDropState.draggedConsultantId = consultant.id;
  }

  onDragEnd(): void {
    if (!this.dragDropState) {
      return;
    }
    this.dragDropState.draggedConsultantId = null;
    this.dragDropState.dragOverConsultantId = null;
  }

  onDragOver(event: DragEvent, target: Consultant): void {
    if (!this.dragDropState || !this.isDropTarget(target)) {
      return;
    }

    const draggedId = this.getDraggedId(event);
    if (!draggedId || !this.canDrop(draggedId, target.id)) {
      return;
    }

    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.dragDropState.dragOverConsultantId = target.id;
  }

  onDragLeave(target: Consultant): void {
    if (this.dragDropState?.dragOverConsultantId === target?.id) {
      this.dragDropState.dragOverConsultantId = null;
    }
  }

  onDrop(event: DragEvent, target: Consultant): void {
    if (!this.dragDropState || !this.isDropTarget(target)) {
      return;
    }

    event.preventDefault();
    const draggedId = this.getDraggedId(event);
    this.dragDropState.dragOverConsultantId = null;

    if (!draggedId || !this.canDrop(draggedId, target.id)) {
      return;
    }

    this.applyMove(draggedId, target.id);
    this.dragDropState.draggedConsultantId = null;
  }

  cancelPendingChanges(): void {
    if (!this.dragDropState?.pendingOperations?.length) {
      return;
    }

    const ops = [...this.dragDropState.pendingOperations].reverse();
    for (const op of ops) {
      this.undoMove(op);
    }

    this.dragDropState.pendingOperations = [];
    this.dragDropState.draggedConsultantId = null;
    this.dragDropState.dragOverConsultantId = null;
  }

  savePendingChanges(): void {
    if (!this.hasPendingChanges() || this.dragDropState.saving) {
      return;
    }

    const consultantsToSave = this.getConsultantsToSave();
    if (!consultantsToSave.length) {
      this.dragDropState.pendingOperations = [];
      return;
    }

    this.dragDropState.saving = true;
    const label = 'saveConsultantHierarchy';
    this.beforeCallServer(label);

    let remaining = consultantsToSave.length;
    let hadError = false;

    consultantsToSave.forEach((consultant) => {
      const payload = this.buildSavePayload(consultant);
      this.consultantService.save(payload as Consultant).subscribe(
        data => {
          this.afterCallServer(label, data);
          if (data?.body?.result) {
            consultant.adminConsultantId = data.body.result.adminConsultantId;
            consultant.adminConsultant = null;
          }
          remaining--;
          if (remaining === 0) {
            this.dragDropState.saving = false;
            if (!hadError) {
              this.dragDropState.pendingOperations = [];
              this.utilsIhm.info(this.utils.tr('Save') + ' OK', null, null);
            }
          }
        },
        error => {
          hadError = true;
          this.addErrorFromErrorOfServer(label, error);
          remaining--;
          if (remaining === 0) {
            this.dragDropState.saving = false;
          }
        }
      );
    });
  }

  private getDraggedId(event: DragEvent): number {
    const fromEvent = event?.dataTransfer?.getData('text/plain');
    const raw = fromEvent || (this.dragDropState?.draggedConsultantId + '');
    const draggedId = Number(raw);
    return Number.isFinite(draggedId) ? draggedId : null;
  }

  private canDrop(draggedId: number, targetId: number): boolean {
    if (!draggedId || !targetId || draggedId === targetId) {
      return false;
    }

    const root = this.dragDropState?.rootConsultant;
    if (!root) {
      return false;
    }

    if (root.id === draggedId) {
      return false;
    }

    const dragged = this.findConsultantWithParent(root, draggedId);
    const target = this.findConsultantWithParent(root, targetId);

    if (!dragged?.node || !target?.node) {
      return false;
    }

    if (!this.isDropTarget(target.node)) {
      return false;
    }

    if (dragged.parent?.id === target.node.id) {
      return false;
    }

    if (this.containsConsultant(dragged.node, targetId)) {
      return false;
    }

    return true;
  }

  private applyMove(draggedId: number, targetId: number): void {
    const root = this.dragDropState.rootConsultant;
    const dragged = this.findConsultantWithParent(root, draggedId);
    const target = this.findConsultantWithParent(root, targetId);

    if (!dragged?.node || !dragged.parent || !target?.node) {
      return;
    }

    const fromList = dragged.parent.listConsultant || [];
    const fromIndex = fromList.findIndex(c => c?.id === draggedId);
    if (fromIndex < 0) {
      return;
    }

    const [node] = fromList.splice(fromIndex, 1);
    if (!target.node.listConsultant) {
      target.node.listConsultant = [];
    }
    target.node.listConsultant.push(node);
    node.adminConsultant = null;
    node.adminConsultantId = target.node.id;

    this.dragDropState.pendingOperations.push({
      consultantId: draggedId,
      fromParentId: dragged.parent.id,
      toParentId: target.node.id,
      fromIndex,
    });
  }

  private undoMove(operation: ConsultantMoveOperation): void {
    const root = this.dragDropState?.rootConsultant;
    if (!root) {
      return;
    }

    const dragged = this.findConsultantWithParent(root, operation.consultantId);
    const originalParent = this.findConsultantWithParent(root, operation.fromParentId);

    if (!dragged?.node || !dragged.parent || !originalParent?.node) {
      return;
    }

    dragged.parent.listConsultant = dragged.parent.listConsultant || [];
    const currentIndex = dragged.parent.listConsultant.findIndex(c => c?.id === operation.consultantId);
    if (currentIndex >= 0) {
      dragged.parent.listConsultant.splice(currentIndex, 1);
    }

    originalParent.node.listConsultant = originalParent.node.listConsultant || [];
    const insertIndex = Math.max(0, Math.min(operation.fromIndex, originalParent.node.listConsultant.length));
    originalParent.node.listConsultant.splice(insertIndex, 0, dragged.node);
    dragged.node.adminConsultant = null;
    dragged.node.adminConsultantId = originalParent.node.id;
  }

  private buildSavePayload(consultant: Consultant): any {
    return {
      ...consultant,
      adminConsultant: null,
      listConsultant: null,
      listActivity: null,
      listCra: null,
      listNoteFrais: null,
      listMsgFrom: null,
      listMsgTo: null,
      listDocument: null,
      address: consultant.address ? { ...consultant.address } : null,
      esn: null,
    };
  }

  private getConsultantsToSave(): Consultant[] {
    const root = this.dragDropState?.rootConsultant;
    if (!root) {
      return [];
    }

    const uniqueIds = new Set<number>();
    for (const op of this.dragDropState.pendingOperations || []) {
      if (op?.consultantId) {
        uniqueIds.add(op.consultantId);
      }
    }

    const consultants: Consultant[] = [];
    uniqueIds.forEach((id) => {
      const info = this.findConsultantWithParent(root, id);
      if (info?.node) {
        consultants.push(info.node);
      }
    });

    return consultants;
  }

  private findConsultantWithParent(root: Consultant, consultantId: number, parent: Consultant = null): { node: Consultant; parent: Consultant } {
    if (!root) {
      return null;
    }

    if (root.id === consultantId) {
      return { node: root, parent };
    }

    if (!root.listConsultant?.length) {
      return null;
    }

    for (const child of root.listConsultant) {
      const found = this.findConsultantWithParent(child, consultantId, root);
      if (found) {
        return found;
      }
    }

    return null;
  }

  private containsConsultant(root: Consultant, consultantId: number): boolean {
    if (!root) {
      return false;
    }

    if (root.id === consultantId) {
      return true;
    }

    if (!root.listConsultant?.length) {
      return false;
    }

    return root.listConsultant.some(child => this.containsConsultant(child, consultantId));
  }

  getListConsultants(resp: Consultant, isForce = false) {

    if(resp == null) {
      this.logger.debug("resp NULL")
      this.addErrorTitleMsg("Error getListConsultants()", "resp NULL")
      return 
    }

    if (isForce || resp.listConsultant == null ) {
      this.beforeCallServer("getListConsultants")
      this.consultantService.findAllChildConsultants(resp).subscribe(
        data => {
          this.logger.debug("findAllChildConsultants : data", data)
          this.afterCallServer("getListConsultants", data)
          if (data != null && data.body != null) {
            resp.listConsultant = data.body.result;
          }else {
            resp.listConsultant = null 
          }
        }, error => {
          this.addErrorFromErrorOfServer("getListConsultants", error);
        }
      );
    }
  }

}

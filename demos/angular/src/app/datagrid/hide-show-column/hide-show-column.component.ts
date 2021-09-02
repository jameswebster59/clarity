import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TestVM } from '@cds/core/demo';
import { VmService } from '../vm.service';

@Component({
  selector: 'app-hide-show-column',
  templateUrl: './hide-show-column.component.html',
  styleUrls: ['./hide-show-column.component.scss'],
})
export class HideShowColumnComponent {
  // Form group for the generated form controls
  hideShowForm!: FormGroup;
  // Store a reference to the click event target for positioning the popover ui w/ hide/show checkboxes
  columnAnchor: EventTarget | null = null;
  data: TestVM[] = [];
  dataFields!: string[];
  // a boolean flag to control column picker element visibility
  hiddenColumnPicker = true;
  showDevNotes = false;

  getControlValue(column: string) {
    return this.hideShowForm.controls.columns.get(column)?.value;
  }

  isColumnVisible(columnType: string): boolean {
    return this.hideShowForm.controls.columns.get(columnType)?.value;
  }

  get allColumnsVisible(): boolean {
    return !!this.dataFields
      .map(column => this.hideShowForm.controls.columns.get(column)?.value)
      .filter(value => !value).length;
  }

  // Set up our data (sync) and get data fields from the service
  // Then set up the hideShowForm with a columns group
  // Then add a new Control for every row of data
  // Want to have some columns never be hide-able? This is the way. Exclude those fields with code.
  constructor(private formBuilder: FormBuilder, private vmData: VmService) {
    this.data = vmData.get();
    this.dataFields = vmData.fields;
    // A reactive form that that we can use to generate a group i=of form controls for each row.
    this.hideShowForm = this.formBuilder.group({
      columns: new FormGroup({}),
    });
    this.dataFields.forEach(df =>
      (this.hideShowForm.controls.columns as FormGroup).addControl(df, new FormControl(true, { updateOn: 'change' }))
    );
  }

  // Use the click target to set the anchor element (so that popover can calculate position
  // when the anchor is set, show the column picker form
  setAnchor(event: Event): void {
    this.columnAnchor = event.target;
    this.hiddenColumnPicker = !this.hiddenColumnPicker;
  }

  // Function that will show all columns
  // This idea is extendable and configurable:
  // Want to exclude some columns from being selected or unselected, this is the way
  showAllColumns(): void {
    this.dataFields.forEach(column => this.hideShowForm.controls.columns.get(column)?.setValue(true));
  }
}
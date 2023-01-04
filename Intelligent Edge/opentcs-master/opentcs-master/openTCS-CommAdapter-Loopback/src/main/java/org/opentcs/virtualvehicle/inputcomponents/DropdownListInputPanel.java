/**
 * Copyright (c) The openTCS Authors.
 *
 * This program is free software and subject to the MIT license. (For details,
 * see the licensing information (LICENSE.txt) you should have received with
 * this copy of the software.)
 */
package org.opentcs.virtualvehicle.inputcomponents;

import java.util.Collections;
import java.util.List;
import static java.util.Objects.requireNonNull;
import java.util.function.Function;
import javax.swing.DefaultComboBoxModel;
import javax.swing.ListCellRenderer;

/**
 * An input panel providing a dropdown list and optionally a message and a
 * label.
 *
 * The <code>Object</code> that is returned by {@link InputPanel#getInput} is
 * an object from the provided content list.
 *
 * @param <E> Type of the elements in the dropdown list
 *
 * @author Tobias Marquardt (Fraunhofer IML)
 */
public final class DropdownListInputPanel<E>
    extends InputPanel {

  /**
   * Create a new panel.
   *
   * @param title Title of the panel.
   */
  private DropdownListInputPanel(String title) {
    super(title);
    initComponents();
  }

  @Override
  protected void captureInput() {
    //if the combobox is editable and the input was entered using the jTextField and 
    //confirmed using the enter button, then the textField's input is not yet saved as the comboBox selection.
    //Thats why it is safer to get the input from the textfield, if the combobox is editable.
    input = comboBox.isEditable() ? comboBox.getEditor().getItem() : comboBox.getSelectedItem();
  }

  // CHECKSTYLE:OFF
  /**
   * This method is called from within the constructor to
   * initialize the form.
   * WARNING: Do NOT modify this code. The content of this method is
   * always regenerated by the Form Editor.
   */
  // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
  private void initComponents() {
    java.awt.GridBagConstraints gridBagConstraints;

    messageLabel = new javax.swing.JLabel();
    label = new javax.swing.JLabel();
    comboBox = new javax.swing.JComboBox<>();

    setLayout(new java.awt.GridBagLayout());

    messageLabel.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
    messageLabel.setText("Message");
    gridBagConstraints = new java.awt.GridBagConstraints();
    gridBagConstraints.gridx = 0;
    gridBagConstraints.gridy = 0;
    gridBagConstraints.gridwidth = 2;
    gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
    gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
    gridBagConstraints.insets = new java.awt.Insets(3, 3, 3, 3);
    add(messageLabel, gridBagConstraints);

    label.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
    label.setText("Label");
    gridBagConstraints = new java.awt.GridBagConstraints();
    gridBagConstraints.gridx = 0;
    gridBagConstraints.gridy = 1;
    gridBagConstraints.insets = new java.awt.Insets(3, 3, 3, 3);
    add(label, gridBagConstraints);

    comboBox.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
    gridBagConstraints = new java.awt.GridBagConstraints();
    gridBagConstraints.gridx = 1;
    gridBagConstraints.gridy = 1;
    gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
    gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
    gridBagConstraints.insets = new java.awt.Insets(3, 3, 3, 3);
    add(comboBox, gridBagConstraints);
  }// </editor-fold>//GEN-END:initComponents
  // Variables declaration - do not modify//GEN-BEGIN:variables
  private javax.swing.JComboBox<E> comboBox;
  private javax.swing.JLabel label;
  private javax.swing.JLabel messageLabel;
  // End of variables declaration//GEN-END:variables
  // CHECKSTYLE:ON

  /**
   * See {@link InputPanel.Builder}.
   *
   * @param <E> Type of the elements in the dropdown list
   */
  public static class Builder<E>
      implements InputPanel.Builder {

    /**
     * The panel's title.
     */
    private final String title;
    /**
     * The optional message.
     */
    private String message;
    /**
     * The label for the dropdown list.
     */
    private String label;
    /**
     * Content for the dropdown list.
     */
    private final List<E> content;
    /**
     * Initially selected index of the dropdown list.
     * Default is 0.
     */
    private int initialIndex;
    /**
     * Whether the combo box should be editable.
     */
    private boolean editable;
    /**
     * Strategy for presenting the E-Objects in View.
     */
    private ListCellRenderer<? super E> renderer;
    /**
     * Function for representing a selected element in the combo box.
     * This is basically a renderer for the combo box editor's content.
     */
    private Function<E, String> selectionRepresenter = o -> o == null ? "" : o.toString();

    /**
     * Create a new <code>Builder</code>.
     *
     * @param title The title of the panel.
     * @param content List of items.
     */
    public Builder(String title, List<E> content) {
      this.title = requireNonNull(title, "title");
      this.content = requireNonNull(content, "content");
    }

    @Override
    public InputPanel build() {
      DropdownListInputPanel<E> panel = new DropdownListInputPanel<>(title);
      panel.messageLabel.setText(message);
      panel.label.setText(label);
      panel.comboBox.setEditable(editable);
      DefaultComboBoxModel<E> model = new DefaultComboBoxModel<>();
      panel.comboBox.setModel(model);

      if (editable) {
        EditableComboBoxEditor<E> editor = new EditableComboBoxEditor<>(
            Collections.unmodifiableList(panel.getValidationListeners()),
            panel.comboBox, selectionRepresenter);
        panel.comboBox.setEditor(editor);
        model.addListDataListener(editor);
      }

      //to notify the editor about new input
      for (E c : content) {
        model.addElement(c);
      }

      if (this.renderer != null) {
        panel.comboBox.setRenderer(this.renderer);
      }
      if (!content.isEmpty()) {
        panel.comboBox.setSelectedIndex(initialIndex);
      }
      return panel;
    }

    /**
     * Set the message of the panel.
     * The user of this method must take care for the line breaks in the message, as it is not
     * wrapped automatically!
     *
     * @param message The message.
     * @return The builder instance.
     */
    public Builder<E> setMessage(String message) {
      this.message = message;
      return this;
    }

    /**
     * Sets the editable flag for the combo box.
     *
     * @param editable The editable flag.
     * @return The builder instance.
     */
    public Builder<E> setEditable(boolean editable) {
      this.editable = editable;
      return this;
    }

    /**
     * Set the CellRenderer for the dropdown list.
     * if none is set, then the default renderer will be used, which calls toString().
     *
     * @param renderer The renderer.
     * @return The builder instance.
     */
    public Builder<E> setRenderer(ListCellRenderer<? super E> renderer) {
      this.renderer = renderer;
      return this;
    }

    /**
     * Set the label of the panel.
     *
     * @param label The label.
     * @return The builder instance.
     */
    public Builder<E> setLabel(String label) {
      this.label = label;
      return this;
    }

    /**
     * Set the initial selected list entry.
     *
     * @param index Must be &gt; 0, will have no effect otherwise.
     * @return The builder instance.
     */
    public Builder<E> setInitialSelection(int index) {
      if (index >= 0) {
        initialIndex = index;
      }
      return this;
    }

    /**
     * Set the initial selected list entry.
     *
     * @param element Element to select. Selection remains unchanged if element is not in drop down
     * list or element is <code>null</code> and the content list does not allow null values.
     * @return The builder instance.
     */
    public Builder<E> setInitialSelection(Object element) {
      int index;
      try {
        index = content.indexOf(element);
      }
      catch (NullPointerException e) {
        index = -1;
      }
      return setInitialSelection(index);
    }

    /**
     * Sets the representer for selected elements in the combo box.
     * This is basically a renderer for the combo box editor's content.
     * If none is set, a default representer will be used, which calls toString().
     *
     * @param selectionRepresenter Function for representing a selected element in the combo box.
     * @return The builder instance.
     */
    public Builder<E> setSelectionRepresenter(Function<E, String> selectionRepresenter) {
      this.selectionRepresenter = selectionRepresenter;
      return this;
    }
  }
}

import React, { Component } from 'react';
import './Folder.css';

export class Folder extends Component {
    static displayName = Folder.name;

    constructor(props) {
        super(props);

        // function bindings
        this.SelectFolder = this.SelectFolder.bind(this);
    }

    componentDidMount() {
        
    }

    render() {
        return (
            <div class="div_folder">
                {
                    // go through each folder
                    this.props.Folders.map((value, index) => {
                        var contents;

                        // if the current folder we are looking at has the parent that was passed in, we add it to the tree
                        if (value.ParentID == this.props.ParentID) {
                            var fold_id = "summary_" + value.ID; // id for the clickable summary tag

                            // if this folder is a parent we need to call a Folder with a new parent.. else we display without the dropdown arrow
                            if (value.HasChild) {
                                contents = (
                                    <details>
                                        <summary id={fold_id} onClick={this.SelectFolder}>{value.FolderName}</summary>
                                        <div class="div_folder_child">
                                            <Folder Folders={this.props.Folders} ParentID={value.ID} SetSelectedFolder={this.props.SetSelectedFolder} />
                                        </div>
                                    </details>
                                );
                            }
                            else {
                                contents = <summary class="summary_without_marker" id={fold_id} onClick={this.SelectFolder}>{value.FolderName}</summary>;
                            }
                        }

                        // return contents in a list tag for indenting.. might change this later because indents are large
                        return contents;
                    }
                    )}
            </div>
        );
    }

    // function to set selected folder and update what the safe is displaying
    async SelectFolder(event) {
        this.props.SetSelectedFolder(event.target.id.replace("summary_", ""));
    }
}

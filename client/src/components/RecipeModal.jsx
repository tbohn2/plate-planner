import React, { useState } from "react";
import { useMutation } from '@apollo/client';
import { UPDATE_RECIPE } from '../utils/mutations';

const RecipeModal = () => {
    return (
        <div className="modal-dialog modal-lg">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Recipe Title</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    This is the recipe modal.
                </div>
            </div>
        </div>
    )
}

export default RecipeModal;

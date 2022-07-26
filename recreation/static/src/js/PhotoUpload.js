/** @odoo-module **/

const { Component } = owl;

class PhotoUpload extends Component {
    encodeImageFileAsURL(element) {
        var file = element.files[0];
        var reader = new FileReader();
        reader.onloadend = () => {
            this.photo = reader.result
        }
        reader.readAsDataURL(file);
      }

    onChangeFile = event => {
        this.encodeImageFileAsURL(event.target)
    }

    onSaveFile = () => {
        this.props.onSavePhoto(...this.photo.split(','));
    }
}

PhotoUpload.template = 'photoupload';

export default PhotoUpload;
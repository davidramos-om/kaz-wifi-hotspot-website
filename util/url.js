
module.exports =
{
    getBaseUrl() {
        return 'https://www.kaz-wifi.com/';
    },

    getHelpUrl() {
        return this.getBaseUrl() + 'faq#/requisitos';
    },

    getDownloadAppUrl() {
        return 'https://kwh-files.nyc3.digitaloceanspaces.com/kaz-wifi-hotspot.msi';
    }
}
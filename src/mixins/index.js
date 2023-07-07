export const utils = {
  computed: {
      isMobile() {
          return this.$vuetify.breakpoint.xs;
      },
      isLoading() {
          return this.$store.getters['process/isProcessing'];
      },
      showNotif() {
          return this.$store.getters['notification/isNotifShow'];
      },
      notifError() {
          return this.$store.getters['notification/isNotifError'];
      },
      notifMessage() {
          return this.$store.getters['notification/getNotifMessage'];
      }
  }
}
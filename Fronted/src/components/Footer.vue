<template>
  <div>
    <!-- Footer -->
    <mdb-footer color="blue" class="font-small pt-4 mt-4">
      <div class="footer-copyright text-center py-3">
        <mdb-container fluid>
          &copy; 2020 Copyright: Doron & Oscar
        </mdb-container>
      </div>
    </mdb-footer>
  </div>
  <!-- Footer -->
</template>

<script>
import { mdbFooter, mdbContainer, mdbRow, mdbCol } from "mdbvue";
export default {
  name: "FooterPage",
  components: {
    mdbFooter,
    mdbContainer,
  },
};
</script>

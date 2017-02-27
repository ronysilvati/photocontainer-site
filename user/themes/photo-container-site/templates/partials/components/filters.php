<div class="form-filters">
  <h5 class="title">Selecione as cores</h5>
  <div class="form-colors">
    <div data-toggle="buttons">
      <?php
      $colors = get_colors();
      foreach ($colors as $key => $value) {
        echo '<label style="background-color:'.$value[1].'" class="btn btn-secondary btn-check btn-color" title="'.$value[0].'">';
        echo '  <input type="checkbox">';
        echo '</label>';
      }
      ?>
    </div>
  </div>
  <h5 class="title mt-5">Selecione as tags</h5>
  <div class="row row-md">
    <?php for ($i=0; $i < 4; $i++) { ?>
    <div class="col-md-3">
      <h6 class="title mt-3 text-center text-uppercase"><small>Cenários</small></h6>
      <hr class="mt-0">
      <div data-toggle="buttons">
        <?php for ($l=0; $l < rand(5,12); $l++) { ?>
        <label class="btn btn-secondary btn-check btn-block">
          <input type="checkbox" autocomplete="off">Hotel
        </label>
        <?php }; ?>
      </div>
    </div>
    <?php }; ?>
  </div>
</div>

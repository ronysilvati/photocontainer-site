<div class="page-header navbar navbar-toggleable-md">
  <div class="container">
    <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target=".page-heade .navbar-collapse" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <?php if (in_array("title", $show)) { ?>
    <h2 class="title navbar-brand hide"><?php echo $title ?></h2>
    <?php }; ?>
    <!-- -->

    <?php if (in_array("btn-back", $show)) { ?>
    <div class="navbar-collapse">
      <a href="#" class="btn btn-sm btn-primary btn-circle"><i class="icon-left-open"></i></a>
      <span class="pl-2 pt-1 text-uppercase"> Voltar para Galeria</span>
    </div>
    <?php }; ?>
    <!-- -->

    <div class="collapse navbar-collapse">
      <!-- <div class=" ml-auto"> -->
        <?php if (in_array("form-search", $show)) { ?>
        <form class="form-inline form-search ml-auto">
          <input class="form-control" type="text" placeholder="BUSCA">
          <button class="btn btn-search" type="submit"><i class="icon-search"></i></button>
        </form>
        <?php }; ?>
        <?php if (in_array("nav-gallery", $show)) { ?>
        <ul class="navbar-nav ml-0">
          <li class="nav-item ml-4">
            <button class="btn btn-sm btn-primary text-uppercase" data-toggle="modal" data-target=".modal-filters">Filtros</button>
          </li>
          <li class="nav-item ml-4">
            <a class="btn btn-sm btn-primary btn-circle" href="#"><i class="icon-help"></i></a>
          </li>
        </ul>
        <?php }; ?>
        <?php if (in_array("nav-add-gallery", $show)) { ?>
        <ul class="nav nav-tabs nav-steps ml-auto">
          <li class="nav-item">
            <a class="nav-link active" data-index="1" data-toggle="tab" href="#evento" role="tab"><span class="badge">1</span> Evento</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-index="2" data-toggle="tab" href="#fornecedores" role="tab"><span class="badge">2</span> Fornecedores </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-index="3" data-toggle="tab" href="#caracteristicas" role="tab"><span class="badge">3</span> Características</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-index="4" data-toggle="tab" href="#fotos" role="tab"><span class="badge">4</span> Fotos</a>
          </li>
        </ul>

        <?php }; ?>
      <!-- </div> -->
    </div>
  </div>
</div>

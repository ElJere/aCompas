Vagrant.configure("2") do |config|
  config.vm.box_url = 'http://cloud-images.ubuntu.com/vagrant/vivid/current/vivid-server-cloudimg-amd64-vagrant-disk1.box'
  config.vm.box = "aCompas"

  config.vm.provider "virtualbox" do |v|
    v.memory = 2048
  end
  
  config.vm.network "private_network", ip: "192.168.50.2"
  config.vm.synced_folder ".",
    "/vagrant",
    :nfs => true,
    :mount_options => ['actimeo=2', 'vers=3', 'tcp', 'fsc']

  config.vm.network "forwarded_port", guest: 8000, host: 8000

  config.vm.provision "shell", path: "provision.sh"

end

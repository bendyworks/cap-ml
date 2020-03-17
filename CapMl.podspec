
  Pod::Spec.new do |s|
    s.name = 'CapMl'
    s.version = '0.0.1'
    s.summary = 'Machine Learning Plugin for Capacitor'
    s.license = 'Hippocratic License Version 2.0'
    s.homepage = 'git@github.com:bendyworks/cap-ml'
    s.author = 'Vennela Kodali'
    s.source = { :git => 'git@github.com:bendyworks/cap-ml', :tag => s.version.to_s }
    s.source_files = 'ios/Plugin/**/*.{swift,h,m,c,cc,mm,cpp}'
    s.ios.deployment_target  = '13.0'
    s.dependency 'Capacitor'
  end
